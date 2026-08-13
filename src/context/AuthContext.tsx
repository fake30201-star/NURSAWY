import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
  is_admin: boolean;
  is_subscribed: boolean;
  full_name: string | null;
}import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export interface PharmacyInfo {
  name: string | null;
  phone: string | null;
  location: string | null;
}

interface Profile {
  is_admin: boolean;
  is_subscribed: boolean;
  full_name: string | null;
  role: 'nurse' | 'pharmacy';
  pharmacy_name: string | null;
  pharmacy_phone: string | null;
  pharmacy_location: string | null;
}

interface RegisterExtra {
  role: 'nurse' | 'pharmacy';
  pharmacyName?: string;
  pharmacyPhone?: string;
  pharmacyLocation?: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: User | null;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
  isSubscribed: boolean;
  role: 'nurse' | 'pharmacy';
  isPharmacy: boolean;
  pharmacyInfo: PharmacyInfo;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, extra: RegisterExtra) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_TOKEN_KEY = 'nursawy_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const kickedOutRef = useRef(false);

  const loadProfile = async (currentUser: User) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin, is_subscribed, full_name, role, pharmacy_name, pharmacy_phone, pharmacy_location')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (data) {
      const metaName = currentUser.user_metadata?.full_name as string | undefined;
      if (!data.full_name && metaName) {
        await supabase.from('profiles').update({ full_name: metaName }).eq('id', currentUser.id);
        setProfile({ ...data, full_name: metaName } as Profile);
      } else {
        setProfile(data as Profile);
      }
    } else {
      // أول تسجيل دخول بعد تأكيد الإيميل: نعمل صف profile جديد بكل البيانات المحفوظة وقت التسجيل
      const meta = currentUser.user_metadata || {};
      const newProfile = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: meta.full_name || null,
        role: meta.role || 'nurse',
        pharmacy_name: meta.pharmacy_name || null,
        pharmacy_phone: meta.pharmacy_phone || null,
        pharmacy_location: meta.pharmacy_location || null,
      };
      await supabase.from('profiles').upsert(newProfile);
      setProfile({
        is_admin: false,
        is_subscribed: false,
        full_name: newProfile.full_name,
        role: newProfile.role,
        pharmacy_name: newProfile.pharmacy_name,
        pharmacy_phone: newProfile.pharmacy_phone,
        pharmacy_location: newProfile.pharmacy_location,
      });
    }
  };

  const claimSession = async (userId: string) => {
    const token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    kickedOutRef.current = false;
    await supabase.from('user_sessions').upsert({
      user_id: userId,
      session_token: token,
      updated_at: new Date().toISOString(),
    });
  };

  const verifySession = async (userId: string) => {
    const localToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!localToken) return;

    const { data } = await supabase
      .from('user_sessions')
      .select('session_token')
      .eq('user_id', userId)
      .maybeSingle();

    if (data && data.session_token !== localToken && !kickedOutRef.current) {
      kickedOutRef.current = true;
      await supabase.auth.signOut();
      localStorage.removeItem(SESSION_TOKEN_KEY);
      alert('تم تسجيل الدخول بهذا الحساب من جهاز آخر، فتم تسجيل خروجك من هذا الجهاز.');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user);
        verifySession(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadProfile(newSession.user);
        if (event === 'SIGNED_IN') {
          claimSession(newSession.user.id);
        }
      } else {
        setProfile(null);
      }
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && session?.user) {
        verifySession(session.user.id);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel(`user_sessions_${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_sessions',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const localToken = localStorage.getItem(SESSION_TOKEN_KEY);
          const newToken = (payload.new as { session_token?: string })?.session_token;
          if (newToken && localToken && newToken !== localToken && !kickedOutRef.current) {
            kickedOutRef.current = true;
            supabase.auth.signOut().then(() => {
              localStorage.removeItem(SESSION_TOKEN_KEY);
              alert('تم تسجيل الدخول بهذا الحساب من جهاز آخر، فتم تسجيل خروجك من هذا الجهاز.');
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateAuthError(error.message));
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    extra: RegisterExtra
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: extra.role,
          pharmacy_name: extra.pharmacyName || null,
          pharmacy_phone: extra.pharmacyPhone || null,
          pharmacy_location: extra.pharmacyLocation || null,
        },
      },
    });
    if (error) throw new Error(translateAuthError(error.message));

    if (data.user && data.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: extra.role,
        pharmacy_name: extra.pharmacyName || null,
        pharmacy_phone: extra.pharmacyPhone || null,
        pharmacy_location: extra.pharmacyLocation || null,
      });
    }

    return { needsEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!session?.user,
        user: session?.user ?? null,
        email: session?.user?.email ?? null,
        fullName: profile?.full_name ?? null,
        isAdmin: !!profile?.is_admin,
        isSubscribed: !!profile?.is_subscribed,
        role: profile?.role || 'nurse',
        isPharmacy: profile?.role === 'pharmacy',
        pharmacyInfo: {
          name: profile?.pharmacy_name ?? null,
          phone: profile?.pharmacy_phone ?? null,
          location: profile?.pharmacy_location ?? null,
        },
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'الإيميل أو كلمة المرور غلط',
    'User already registered': 'الإيميل ده مسجل بالفعل، جرب تسجيل الدخول',
    'Password should be at least 6 characters': 'كلمة المرور لازم تكون 6 حروف على الأقل',
    'Email not confirmed': 'لازم تأكد إيميلك الأول من الرسالة المرسلة لك',
  };
  return map[message] || message;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth لازم يتستخدم جوه AuthProvider');
  return ctx;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: User | null;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
  isSubscribed: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_TOKEN_KEY = 'nursawy_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const kickedOutRef = useRef(false); // يمنع تكرار رسالة "تم تسجيل الخروج" أكتر من مرة

  const loadProfile = async (currentUser: User) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin, is_subscribed, full_name')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (data) {
      // لو الاسم لسه مش محفوظ في profiles بس محفوظ في بيانات الحساب وقت التسجيل، نحفظه دلوقتي.
      const metaName = currentUser.user_metadata?.full_name as string | undefined;
      if (!data.full_name && metaName) {
        await supabase.from('profiles').update({ full_name: metaName }).eq('id', currentUser.id);
        setProfile({ ...data, full_name: metaName } as Profile);
      } else {
        setProfile(data as Profile);
      }
    } else {
      // أول تسجيل دخول بعد تأكيد الإيميل: نعمل صف profile جديد بالاسم المحفوظ وقت التسجيل.
      const metaName = (currentUser.user_metadata?.full_name as string | undefined) || null;
      const newProfile = { id: currentUser.id, email: currentUser.email, full_name: metaName };
      await supabase.from('profiles').upsert(newProfile);
      setProfile({ is_admin: false, is_subscribed: false, full_name: metaName });
    }
  };

  // بيسجَّل الجهاز ده كـ"الجهاز النشط الوحيد" لهذا الحساب، ويحفظ توكن مميز محليًا.
  const claimSession = async (userId: string) => {
    const token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    kickedOutRef.current = false;
    await supabase.from('user_sessions').upsert({
      user_id: userId,
      session_token: token,
      updated_at: new Date().toISOString(),
    });
  };

  // بيتأكد إن التوكن المحفوظ محليًا لسه هو نفسه المسجل في قاعدة البيانات، وإلا يسجل خروج فورًا.
  const verifySession = async (userId: string) => {
    const localToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!localToken) return;

    const { data } = await supabase
      .from('user_sessions')
      .select('session_token')
      .eq('user_id', userId)
      .maybeSingle();

    if (data && data.session_token !== localToken && !kickedOutRef.current) {
      kickedOutRef.current = true;
      await supabase.auth.signOut();
      localStorage.removeItem(SESSION_TOKEN_KEY);
      alert('تم تسجيل الدخول بهذا الحساب من جهاز آخر، فتم تسجيل خروجك من هذا الجهاز.');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user);
        verifySession(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadProfile(newSession.user);
        if (event === 'SIGNED_IN') {
          claimSession(newSession.user.id);
        }
      } else {
        setProfile(null);
      }
    });

    // فحص إضافي كل مرة يرجع فيها المستخدم للتاب/التطبيق (زي فتح التطبيق تاني بعد ما يكون قافل)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && session?.user) {
        verifySession(session.user.id);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // متابعة فورية (Realtime): لو حد سجل دخول بنفس الحساب من جهاز تاني، الجهاز ده يتسجل خروج فورًا من غير ما يحتاج يعمل refresh.
  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel(`user_sessions_${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_sessions',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const localToken = localStorage.getItem(SESSION_TOKEN_KEY);
          const newToken = (payload.new as { session_token?: string })?.session_token;
          if (newToken && localToken && newToken !== localToken && !kickedOutRef.current) {
            kickedOutRef.current = true;
            supabase.auth.signOut().then(() => {
              localStorage.removeItem(SESSION_TOKEN_KEY);
              alert('تم تسجيل الدخول بهذا الحساب من جهاز آخر، فتم تسجيل خروجك من هذا الجهاز.');
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateAuthError(error.message));
  };

  const register = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw new Error(translateAuthError(error.message));

    // لو التسجيل نجح وفيه جلسة فورية (تأكيد الإيميل غير مفعّل)، ننشئ صف profile مباشرة بالاسم.
    if (data.user && data.session) {
      await supabase.from('profiles').upsert({ id: data.user.id, email, full_name: fullName });
    }

    // لو مفيش session فوري، معناه Supabase محتاج تأكيد عبر الإيميل قبل الدخول.
    return { needsEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!session?.user,
        user: session?.user ?? null,
        email: session?.user?.email ?? null,
        fullName: profile?.full_name ?? null,
        isAdmin: !!profile?.is_admin,
        isSubscribed: !!profile?.is_subscribed,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'الإيميل أو كلمة المرور غلط',
    'User already registered': 'الإيميل ده مسجل بالفعل، جرب تسجيل الدخول',
    'Password should be at least 6 characters': 'كلمة المرور لازم تكون 6 حروف على الأقل',
    'Email not confirmed': 'لازم تأكد إيميلك الأول من الرسالة المرسلة لك',
  };
  return map[message] || message;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth لازم يتستخدم جوه AuthProvider');
  return ctx;
}
