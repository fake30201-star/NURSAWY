import React, { useState } from 'react';
import { OSCE_SKILLS } from '../data/clinicalData';
import { Video, CheckCircle2, RotateCcw, Sparkles, Loader2, Award, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import { askPuterAI } from '../lib/puterAi';

// يحول أي رابط يوتيوب عادي (youtu.be، watch?v=، shorts/) لصيغة embed قابلة للعرض جوه iframe.
// كده تقدر تلصق أي رابط يوتيوب عادي (اللي بتنسخه من زرار Share) في videoUrl مباشرة.
function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = '';

    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else if (u.pathname.startsWith('/shorts/')) {
      videoId = u.pathname.replace('/shorts/', '');
    } else if (u.pathname.startsWith('/embed/')) {
      return url; // already an embed link
    } else if (u.searchParams.get('v')) {
      videoId = u.searchParams.get('v') || '';
    }

    videoId = videoId.split('?')[0].split('&')[0];
    if (!videoId) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

interface OsceSkillsSectionProps {
  completedStepsMap: Record<string, boolean[]>;
  onToggleStep: (skillId: string, stepIndex: number) => void;
  onResetSkill: (skillId: string) => void;
}

export const OsceSkillsSection: React.FC<OsceSkillsSectionProps> = ({
  completedStepsMap,
  onToggleStep,
  onResetSkill,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(OSCE_SKILLS[0].id);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  const activeSkill = OSCE_SKILLS.find((s) => s.id === selectedSkillId) || OSCE_SKILLS[0];
  const skillStepsState = completedStepsMap[activeSkill.id] || new Array(activeSkill.steps.length).fill(false);
  const embedUrl = toEmbedUrl(activeSkill.videoUrl);

  const activeIndex = OSCE_SKILLS.findIndex((s) => s.id === activeSkill.id);
  const prevSkill = OSCE_SKILLS[(activeIndex - 1 + OSCE_SKILLS.length) % OSCE_SKILLS.length];
  const nextSkill = OSCE_SKILLS[(activeIndex + 1) % OSCE_SKILLS.length];

  const goToSkill = (skillId: string) => {
    setSelectedSkillId(skillId);
    setAiAdvice(null);
  };

  const completedCount = skillStepsState.filter(Boolean).length;
  const totalSteps = activeSkill.steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleAiEvaluation = async () => {
    setEvalLoading(true);
    setAiAdvice(null);

    try {
      const completedStepsList = activeSkill.steps.filter((_, idx) => skillStepsState[idx]);
      const systemPrompt = 'أنت مقيم إكلينيكي واختبارات OSCE للتمريض، قدم ملاحظات بناءة ونصائح دقيقة للتعقيم وتفادي العدوى.';
      const prompt = `المهارة: ${activeSkill.title}
الخطوات المكتملة: ${completedCount} من أصل ${totalSteps}.
الخطوات التي نفذها المتدرب: ${JSON.stringify(completedStepsList)}

قدم تقييماً إكلينيكياً مشجعاً وملاحظات عملية لتلافي الأخطاء الشائعة وتعقيم المكان وفق معايير OSCE باللغة العربية.`;

      const advice = await askPuterAI(systemPrompt, prompt, false);
      setAiAdvice(advice);
    } catch (err: any) {
      console.error(err);
      setAiAdvice('حدث خطأ أثناء التواصل مع محاكي التقييم الإكلينيكي.');
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
          <Video className="w-5 h-5" />
          <span>محاكاة وتدريب مهارات الـ OSCE التمريضية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          مهارات الـ OSCE وقوائم التدقيق التفاعلية
        </h2>
        <p className="text-slate-400 text-sm">
          اتبع خطوات كل مهارة عملياً، حدد الخطوات المكتملة، واحصل على تقييم إكلينيكي مباشر من الذكاء الاصطناعي.
        </p>
      </div>

      {/* Skill Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {OSCE_SKILLS.map((skill) => {
          const isSelected = skill.id === activeSkill.id;
          const skillState = completedStepsMap[skill.id] || [];
          const skillCompletedCount = skillState.filter(Boolean).length;

          return (
            <button
              key={skill.id}
              onClick={() => {
                setSelectedSkillId(skill.id);
                setAiAdvice(null);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-102'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{skill.title}</span>
              {skillCompletedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {skillCompletedCount}/{skill.steps.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prev / Next Skill Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => goToSkill(prevSkill.id)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="truncate max-w-[140px] sm:max-w-none">السابقة: {prevSkill.title}</span>
        </button>

        <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">
          {activeIndex + 1} / {OSCE_SKILLS.length}
        </span>

        <button
          onClick={() => goToSkill(nextSkill.id)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <span className="truncate max-w-[140px] sm:max-w-none">التالية: {nextSkill.title}</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Video / Description Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-purple-500/20 overflow-hidden shadow-xl shadow-purple-950/20 space-y-4">
            <div className="relative aspect-video bg-black">
              {!embedUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6 bg-slate-950">
                  <Video className="w-8 h-8 text-purple-400/60" />
                  <p className="text-slate-400 text-xs sm:text-sm font-bold">
                    لم تتم إضافة رابط الفيديو بعد
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    ألصق رابط يوتيوب عادي (Share) في videoUrl الخاص بـ "{activeSkill.id}" داخل clinicalData.ts
                  </p>
                </div>
              ) : (
                <iframe
                  src={embedUrl}
                  title={activeSkill.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              )}
            </div>

            <div className="p-5 space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeSkill.category}
              </span>
              <h3 className="text-xl font-black text-white">{activeSkill.title}</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {activeSkill.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Checklist Column */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-purple-500/20 rounded-3xl p-6 space-y-6 shadow-xl shadow-purple-950/20">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>قائمة التدقيق لمهمة الـ OSCE</span>
              </h3>
              <p className="text-xs text-slate-400">قم بتحديد الخطوات التي نفذتها بالترتيب الدقيق.</p>
            </div>

            <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {completedCount} / {totalSteps} خطوة ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step List */}
          <div className="space-y-3">
            {activeSkill.steps.map((stepText, idx) => {
              const isChecked = skillStepsState[idx] || false;
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-purple-500/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleStep(activeSkill.id, idx)}
                    className="mt-1 w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0"
                  />
                  <span className={`flex-1 ${isChecked ? 'opacity-80' : ''}`}>
                    {(() => {
                      const parts = stepText.split('||');
                      const original = parts[0];
                      const translation = parts[1];
                      return (
                        <>
                          <span className={`block text-sm leading-relaxed font-medium ${isChecked ? 'line-through' : ''}`}>
                            {original}
                          </span>
                          {translation && (
                            <span className="block text-xs leading-relaxed font-normal text-cyan-300/80 mt-1">
                              {translation}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => onResetSkill(activeSkill.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط المهارة</span>
            </button>

            <button
              onClick={handleAiEvaluation}
              disabled={evalLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {evalLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التقييم...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>تقييم المهارة بالذكاء الاصطناعي 🤖</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback Box */}
          {aiAdvice && (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 text-purple-100 text-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2 font-black text-cyan-300">
                <Award className="w-5 h-5 text-cyan-400" />
                <span>تقييم المحاكاة وتوجيه المقيم الإكلينيكي:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {aiAdvice}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
