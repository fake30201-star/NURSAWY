cat > /home/claude/nursawy_final/src/context/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
  is_admin: boolean;
  is_subscribed: boolean;
  full_name: string | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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
EOF
echo "الملف اتحفظ"
