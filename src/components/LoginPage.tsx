import { CheckCircle2, Eye, EyeOff, Lock, LogIn, Mail, MapPin, Phone, ShieldCheck, Stethoscope, Store, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [accountRole, setAccountRole] = useState<'nurse' | 'pharmacy'>('nurse');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // بيانات إضافية لحساب الصيدلية
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyLat, setPharmacyLat] = useState<number | null>(null);
  const [pharmacyLng, setPharmacyLng] = useState<number | null>(null);
  const [locatingPharmacy, setLocatingPharmacy] = useState(false);

  const handleDetectPharmacyLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح ده مش بيدعم تحديد الموقع');
      return;
    }
    setLocatingPharmacy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPharmacyLat(pos.coords.latitude);
        setPharmacyLng(pos.coords.longitude);
        setLocatingPharmacy(false);
      },
      () => {
        setError('تعذر تحديد موقعك، تأكد من تفعيل صلاحية الموقع للمتصفح');
        setLocatingPharmacy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess();
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          setError('من فضلك اكتب اسمك');
          setLoading(false);
          return;
        }
        if (accountRole === 'pharmacy') {
          if (!pharmacyName.trim() || !pharmacyPhone.trim() || !pharmacyAddress.trim()) {
            setError('من فضلك اكمل بيانات الصيدلية: الاسم، الرقم، والموقع');
            setLoading(false);
            return;
          }
        }
        const { needsEmailConfirmation } = await register(
          email,
          password,
          fullName.trim(),
          accountRole,
          accountRole === 'pharmacy'
            ? {
                pharmacy_name: pharmacyName.trim(),
                pharmacy_phone: pharmacyPhone.trim(),
                pharmacy_address: pharmacyAddress.trim(),
                pharmacy_lat: pharmacyLat,
                pharmacy_lng: pharmacyLng,
              }
            : undefined
        );
        if (needsEmailConfirmation) {
          setInfo('تم إنشاء الحساب! افتح بريدك الإلكتروني وأكّد الحساب، بعدين سجّل الدخول.');
          setMode('login');
        } else {
          onSuccess();
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('اكتب إيميلك الأول');
          setLoading(false);
          return;
        }
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (resetError) throw new Error(resetError.message);
        setInfo('تم إرسال رابط إعادة تعيين كلمة المرور لإيميلك. افتح بريدك واتبع الخطوات.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    resetMessages();
  };

  return (
    <div className="dir-rtl max-w-md mx-auto mt-12 mb-12">
      <div className="rounded-3xl border border-purple-500/20 bg-slate-900/70 backdrop-blur-xl p-8 shadow-xl shadow-purple-950/30">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' && 'تسجيل الدخول'}
            {mode === 'register' && 'إنشاء حساب جديد'}
            {mode === 'forgot' && 'استعادة كلمة المرور'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'سجّل دخولك للاستمرار في استخدام المنصة'}
            {mode === 'register' && 'أنشئ حسابك للبدء في استخدام Nursawy'}
            {mode === 'forgot' && 'هنبعتلك رابط لإعادة تعيين كلمة المرور على إيميلك'}
          </p>
        </div>

        {/* Toggle between login / register (مش ظاهر في وضع استعادة كلمة المرور) */}
        {mode !== 'forgot' && (
          <div className="flex items-center bg-slate-950 rounded-xl p-1 mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              حساب جديد
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع الحساب</label>
                <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAccountRole('nurse')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountRole === 'nurse' ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    ممرض / ممرضة
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountRole('pharmacy')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountRole === 'pharmacy' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    صيدلية
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {accountRole === 'pharmacy' ? 'اسم المسؤول' : 'الاسم'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-purple-500/60"
                    placeholder="اسمك اللي هيظهر في الموقع"
                  />
                </div>
              </div>

              {accountRole === 'pharmacy' && (
                <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم الصيدلية</label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-emerald-500/60"
                        placeholder="مثال: صيدلية النور"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم تليفون الصيدلية</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={pharmacyPhone}
                        onChange={(e) => setPharmacyPhone(e.target.value)}
                        dir="ltr"
                        className="w-full rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-emerald-500/60 text-left"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">لوكيشن الصيدلية (العنوان)</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={pharmacyAddress}
                        onChange={(e) => setPharmacyAddress(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-emerald-500/60"
                        placeholder="العنوان بالتفصيل (الحي، الشارع، علامة مميزة)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectPharmacyLocation}
                      disabled={locatingPharmacy}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 rounded-lg py-2 hover:bg-emerald-500/10 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {locatingPharmacy
                        ? 'جارِ تحديد الموقع...'
                        : pharmacyLat
                        ? 'تم تحديد إحداثيات الصيدلية ✓ (اضغط لإعادة التحديد)'
                        : 'تحديد موقعي الحالي على الخريطة'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-purple-500/60"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 pr-9 pl-10 text-sm focus:outline-none focus:border-purple-500/60"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 cursor-pointer underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {info && (
            <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 text-sm cursor-pointer disabled:opacity-50"
          >
            {mode === 'login' && <LogIn className="w-4 h-4" />}
            {mode === 'register' && <UserPlus className="w-4 h-4" />}
            {mode === 'forgot' && <Mail className="w-4 h-4" />}
            {loading
              ? 'جارِ التحميل...'
              : mode === 'login'
              ? 'تسجيل الدخول'
              : mode === 'register'
              ? 'إنشاء الحساب'
              : 'إرسال رابط الاستعادة'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-300 cursor-pointer"
            >
              رجوع لتسجيل الدخول
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
