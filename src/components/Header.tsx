import React from 'react';
import { Activity, Stethoscope, Sparkles, Moon, Sun, ShieldCheck, LogOut, Crown } from 'lucide-react';
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-purple-500/20 shadow-lg shadow-purple-950/30 transition-all dir-rtl overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        
        {/* Brand (Logo, Title, and M for MADA badge) - Right side */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                Nursawy
              </span>
              <a
                href="https://protofile-sepia.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm hover:bg-purple-500/30 transition-colors cursor-pointer"
              >
                <Sparkles className="w-2 h-2 text-cyan-400" />
                تصميم M for MADA
              </a>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">منصة التمريض الإكلينيكي المتقدم</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-purple-500/20 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
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

        {/* Left Actions (Vertical on mobile, Horizontal on desktop - Compact) */}
        <div className="flex flex-col lg:flex-row items-end lg:items-center gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
              title="تبديل المظهر"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn && (
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-all text-[10px] font-bold cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden md:inline">خروج</span>
              </button>
            )}
          </div>

          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('my-progress')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[9px] sm:text-[10px] font-bold cursor-pointer hover:bg-purple-900/50 hover:border-purple-400/50 transition-all max-w-[120px] sm:max-w-[150px]"
              title="اعرض تقدمك الشخصي"
            >
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span className="truncate">{fullName || email}{isAdmin ? ' (أدمن)' : ''}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden flex items-center gap-1.5 px-2 py-1 bg-slate-900/95 overflow-x-auto border-t border-purple-500/10 no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
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
