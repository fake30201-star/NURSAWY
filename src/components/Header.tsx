import React from 'react';
import { Activity, Stethoscope, Sparkles, Moon, Sun, ShieldCheck, LogIn, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}) => {
  const { isLoggedIn, logout, email, isAdmin, fullName } = useAuth();
  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'dictionary', label: 'القاموس والذكاء الاصطناعي 🩺' },
    { id: 'skills', label: 'مهارات OSCE' },
    { id: 'calculator', label: 'حاسبة المحاليل 🧮' },
    { id: 'emergency', label: 'طوارئ ⚡' },
    { id: 'handover', label: 'المناوبات SBAR 📝' },
    { id: 'case-sim', label: 'محاكي الحالات 🎓' },
    ...(isLoggedIn ? [{ id: 'reminders', label: 'التذكيرات 🔔' }] : []),
    ...(isLoggedIn ? [{ id: 'contact', label: 'تواصل معنا 💬' }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'لوحة التحكم 👑' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-purple-500/20 shadow-lg shadow-purple-950/30 transition-all dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                Nursawy
              </span>
              {/* رابط شارة "تصميم M for MADA" — غيّر href هنا لأي رابط تحب توديه (حسابك، بورتفوليو...) */}
              <a
                href="https://example.com/m-for-mada"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm hover:bg-purple-500/30 transition-colors cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                تصميم M for MADA
              </a>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">منصة التمريض الإكلينيكي المتقدم</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-purple-500/20 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-purple-500/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
            title="تبديل المظهر"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('my-progress')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-bold cursor-pointer hover:bg-purple-900/50 hover:border-purple-400/50 transition-all"
              title="اعرض تقدمك الشخصي"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{fullName || email}{isAdmin ? ' (أدمن)' : ''}</span>
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">خروج</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs font-bold cursor-pointer"
              title="تسجيل الدخول"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">دخول</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900/95 overflow-x-auto border-t border-purple-500/10 no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-300 bg-slate-800/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
