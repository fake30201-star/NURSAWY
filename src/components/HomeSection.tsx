import React from 'react';
import { Sparkles, Video, Calculator, AlertTriangle, BookOpen, FileText, Bot, ArrowLeft, Activity, ShieldAlert } from 'lucide-react';
import { EditableText } from './EditableText';
import { useAuth } from '../context/AuthContext';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  overallProgress: number;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate, overallProgress }) => {
  const { isLoggedIn, fullName, email } = useAuth();
  const displayName = fullName || email;
  return (
    <div className="space-y-8 dir-rtl">
      
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-purple-500/30 p-6 sm:p-10 shadow-2xl shadow-purple-950/40">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shadow-sm shadow-cyan-400/50" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>الجيل الجديد للتعليم والرعاية التمريضية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {isLoggedIn ? (
                <span>
                  أهلاً بك يا <span className="text-cyan-300">{displayName}</span> في لوحة التحكم الإكلينيكية الذكية
                </span>
              ) : (
                <EditableText
                  contentKey="home.heroTitle"
                  defaultValue="أهلاً بك في لوحة التحكم الإكلينيكية الذكية"
                  as="span"
                />
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              <EditableText
                contentKey="home.heroSubtitle"
                defaultValue="استفد من الذكاء الاصطناعي المباشر لتحليل الأدوية والأعراض، حساب المحاليل الوريدية، محاكاة مهارات الـ OSCE وتنسيق تسليم المناوبات بأسلوب SBAR المعتمد."
                as="span"
                multiline
              />
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('dictionary')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>المساعد الطبي الإكلينيكي الذكي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('emergency')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-950/30 font-bold text-sm transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>بروتوكولات الطوارئ (Code Blue)</span>
              </button>
            </div>
          </div>

          {/* Progress Widget */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-purple-500/20 text-center space-y-3 shadow-inner">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400">
              <Activity className="w-8 h-8" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {overallProgress}%
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              نسبة إنجاز مهارات الـ OSCE
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div
          onClick={() => onNavigate('dictionary')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-cyan-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
            القاموس الإكلينيكي والاستشارة الذكية
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            ابحث فوراً بالذكاء الاصطناعي عن أي دواء، مرض، أو تحليل لمعرفة الآلية المرضية وخطة الرعاية التمريضية.
          </p>
        </div>

        <div
          onClick={() => onNavigate('skills')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-purple-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors">
            محاكاة مهارات OSCE
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            قوائم تدقيق تفاعلية لتركيب الكانيولا، الرايل، قياس الحرارة والنبض مع تقييم ذكي إكلينيكي لكل خطوة.
          </p>
        </div>

        <div
          onClick={() => onNavigate('calculator')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-emerald-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-emerald-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
            حاسبة معدل التقطير بالأمان
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            احتساب دقيق لعدد القطرات في الدقيقة (Micro/Macro) مع فحص أمان وإرشادات التدفّق بالذكاء الاصطناعي.
          </p>
        </div>

        <div
          onClick={() => onNavigate('emergency')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-red-500/20 hover:border-red-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-red-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-red-300 transition-colors">
            بروتوكولات كود بلو والطوارئ 🚨
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            خطوات الإنعاش القلبي (CPR)، استخدام الـ AED، التعامل مع الصدمة التحسسية واختناق مجرى الهواء.
          </p>
        </div>

        <div
          onClick={() => onNavigate('handover')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-indigo-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
            دفتر تسليم المناوبات بـ SBAR
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            دوّن ملاحظات الشيفت بمرونة وحوّلها بنقرة زر واحدة بـ AI إلى تقرير تسليم SBAR معتمد واحترافي.
          </p>
        </div>

        <div
          onClick={() => onNavigate('case-sim')}
          className="group p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-pink-400/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-pink-950/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-pink-300 transition-colors">
            محاكي الحالات الإكلينيكية
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            سيناريوهات حية تفاعلية لاختبار قدرتك على اتخاذ القرارات التمريضية السريعة والتحقق من النتيجة.
          </p>
        </div>

      </div>
    </div>
  );
};
