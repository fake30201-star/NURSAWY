cat > /home/claude/nursawy_final/src/components/LoginPage.tsx << 'EOF'
import { Lock, LogIn, Mail, ShieldCheck, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess();
      } else {
        if (!fullName.trim()) {
          setError('من فضلك اكتب اسمك');
          setLoading(false);
          return;
        }
        const { needsEmailConfirmation } = await register(email, password, fullName.trim());
        if (needsEmailConfirmation) {
          setInfo('تم إنشاء الحساب! افتح بريدك الإلكتروني وأكّد الحساب، بعدين سجّل الدخول.');
          setMode('login');
        } else {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
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
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'سجّل دخولك للاستمرار في استخدام المنصة' : 'أنشئ حسابك للبدء في استخدام Nursawy'}
          </p>
        </div>

        {/* Toggle between login / register */}
        <div className="flex items-center bg-slate-950 rounded-xl p-1 mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setInfo(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setInfo(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم</label>
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

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:border-purple-500/60"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {info && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 text-sm cursor-pointer disabled:opacity-50"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'جارِ التحميل...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>
        </form>
      </div>
    </div>
  );
};
EOF
echo "الملف اتحفظ"
