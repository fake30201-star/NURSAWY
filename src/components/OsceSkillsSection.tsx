import React, { useState } from 'react';
import { OSCE_SKILLS } from '../data/clinicalData';
import { Video, CheckCircle2, RotateCcw, Sparkles, Loader2, Award, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import { askPuterAI } from '../lib/puterAi';

// يحول أي رابط يوتيوب عادي (youtu.be، watch?v=، shorts/) لصيغة embed قابلة للعرض جوه iframe.
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
      return url;
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
  // بيتحكم في حركة الانتقال بين المهارات (إحساس سكرول/كاروسيل بدل القفز المفاجئ)
  const [slideState, setSlideState] = useState<'idle' | 'out-right' | 'out-left' | 'in-right' | 'in-left'>('idle');

  const activeSkill = OSCE_SKILLS.find((s) => s.id === selectedSkillId) || OSCE_SKILLS[0];
  const skillStepsState = completedStepsMap[activeSkill.id] || new Array(activeSkill.steps.length).fill(false);
  const embedUrl = toEmbedUrl(activeSkill.videoUrl);

  const activeIndex = OSCE_SKILLS.findIndex((s) => s.id === activeSkill.id);
  const prevSkill = OSCE_SKILLS[(activeIndex - 1 + OSCE_SKILLS.length) % OSCE_SKILLS.length];
  const nextSkill = OSCE_SKILLS[(activeIndex + 1) % OSCE_SKILLS.length];

  const completedCount = skillStepsState.filter(Boolean).length;
  const totalSteps = activeSkill.steps.length;
  const skillProgressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // التنقل بين المهارات بحركة سكرول سلسة (السهم اللي بيدوس عليه بيحدد اتجاه الحركة)
  const navigateToSkill = (targetId: string, direction: 'next' | 'prev') => {
    if (slideState !== 'idle') return; // يمنع الضغط المتكرر أثناء الحركة
    setAiAdvice(null);

    setSlideState(direction === 'next' ? 'out-left' : 'out-right');

    setTimeout(() => {
      setSelectedSkillId(targetId);
      setSlideState(direction === 'next' ? 'in-right' : 'in-left');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideState('idle');
        });
      });
    }, 180);
  };

  const slideClass =
    slideState === 'out-right'
      ? 'opacity-0 translate-x-6'
      : slideState === 'out-left'
      ? 'opacity-0 -translate-x-6'
      : slideState === 'in-right'
      ? 'opacity-0 translate-x-6'
      : slideState === 'in-left'
      ? 'opacity-0 -translate-x-6'
      : 'opacity-100 translate-x-0';

  const handleEvaluate = async () => {
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
      alert(err.message || 'حدث خطأ أثناء تقييم المهارة بالذكاء الاصطناعي.');
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="dir-rtl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">مهارات OSCE التفاعلية</h2>
          <p className="text-xs text-slate-400">قوائم تدقيق رسمية معتمدة مع فيديو توضيحي وترجمة لكل خطوة</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-slate-900 border border-purple-500/20 rounded-2xl px-4 py-3">
        <button
          onClick={() => navigateToSkill(prevSkill.id, 'prev')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="hidden sm:inline">السابقة</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          {activeIndex + 1} / {OSCE_SKILLS.length}
        </span>

        <button
          onClick={() => navigateToSkill(nextSkill.id, 'next')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all"
        >
          <span className="hidden sm:inline">التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Content (with slide transition) */}
      <div className={`transition-all duration-200 ease-out ${slideClass}`}>
        <div className="bg-slate-900 border border-purple-500/20 rounded-3xl overflow-hidden">
          {/* Video */}
          <div className="aspect-video bg-slate-950 relative">
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
            <h3 className="text-lg sm:text-xl font-extrabold text-white">{activeSkill.title}</h3>
            <p className="text-sm text-slate-400">{activeSkill.description}</p>

            {/* Progress bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>التقدم في المهارة</span>
                <span className="font-bold text-emerald-400">{skillProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${skillProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="border-t border-purple-500/10 p-5 space-y-2.5">
            {activeSkill.steps.map((stepText, idx) => {
              const isChecked = skillStepsState[idx];
              const parts = stepText.split('||');
              const original = parts[0];
              const translation = parts[1];
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-purple-500/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleStep(activeSkill.id, idx)}
                    className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <span className={`flex-1 ${isChecked ? 'opacity-80' : ''}`}>
                    <span className={`block text-sm leading-relaxed font-medium ${isChecked ? 'line-through' : ''}`}>
                      {original}
                    </span>
                    {translation && (
                      <span className="block text-xs leading-relaxed font-normal text-cyan-300/80 mt-1">
                        {translation}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Actions */}
          <div className="border-t border-purple-500/10 p-5 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleEvaluate}
              disabled={evalLoading || completedCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-sm cursor-pointer disabled:opacity-50 transition-all"
            >
              {evalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              تقييم أدائي بالذكاء الاصطناعي
            </button>
            <button
              onClick={() => onResetSkill(activeSkill.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" /> إعادة تعيين
            </button>
          </div>

          {aiAdvice && (
            <div className="border-t border-purple-500/10 p-5">
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-500/40 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200 leading-relaxed">{aiAdvice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
