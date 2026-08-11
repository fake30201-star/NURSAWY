import React, { useState } from 'react';
import { Bot, Sparkles, Loader2, Heart, Activity, CheckCircle, RefreshCw, Send, ShieldAlert } from 'lucide-react';
import { ClinicalCase } from '../types';
import { askPuterAI } from '../lib/puterAi';

const CLINICAL_CASE_SYSTEM_PROMPT = `أنت محاكي حالات إكلينيكية تمريضية تفاعلية. تقدم استجابات فسيولوجية واقعية لقرارات التمريض باللغة العربية.
رد بصيغة JSON فقط بالمفاتيح التالية بالضبط:
{
  "caseTitle": "عنوان الحالة الإكلينيكية",
  "patientProfile": "بيانات وتاريخ المريض وعمره",
  "vitals": "العلامات الحيوية الحالية (الضغط، النبض، الحرارة، التنفس، SpO2)",
  "description": "تفاصيل الحالة والتطورات المرضية الحالية",
  "evaluation": "تقييم قرار المتدرب (عند وجود إجابة سابقة، وإلا اتركها فارغة)",
  "options": ["خيار 1", "خيار 2", "خيار 3"],
  "isResolved": false
}`;

export const ClinicalCaseSimulator: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [caseHistory, setCaseHistory] = useState<{ role: 'action' | 'evaluation'; text: string }[]>([]);
  const [specialty, setSpecialty] = useState<string>('عام / طوارئ');

  const SPECIALTIES = ['عام / طوارئ', 'باطنة عامة', 'جراحة', 'أطفال', 'عناية مركزة (ICU)', 'نساء وتوليد'];

  const handleGenerateCase = async () => {
    setLoading(true);
    setCustomAction('');
    setCaseHistory([]);

    try {
      const prompt = `قم بتوليد سيناريو حالة مرضية تمريضية طارئة تفاعلية وجديدة ضمن تخصص "${specialty}" باللغة العربية.
قدم وصف الحالة، العلامات الحيوية الأولية، و3 خيارات أو خطوات تمريضية مقترحة.`;

      const raw = await askPuterAI(CLINICAL_CASE_SYSTEM_PROMPT, prompt, true);
      const data = JSON.parse(raw);
      setCurrentCase(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء الاتصال بمحاكي الحالات.');
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAction = async (actionText: string) => {
    if (!actionText.trim() || !currentCase) return;

    setLoading(true);
    setCaseHistory((prev) => [...prev, { role: 'action', text: actionText }]);

    try {
      const prompt = `الحالة الحالية: ${JSON.stringify(currentCase)}
القرار الذي اتخذه التمريض: "${actionText}"

قيّم صحة القرار التمريضي وهل حسّن حالة المريض أم ساءت العلامات الحيوية؟ قدم تطور الحالة بعد هذا الإجراء والخطوة التالية باللغة العربية.`;

      const raw = await askPuterAI(CLINICAL_CASE_SYSTEM_PROMPT, prompt, true);
      const data = JSON.parse(raw);
      setCurrentCase(data);
      if (data.evaluation) {
        setCaseHistory((prev) => [...prev, { role: 'evaluation', text: data.evaluation }]);
      }
      setCustomAction('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء تقييم القرار بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && customAction.trim()) {
      handleTakeAction(customAction);
    }
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
          <Bot className="w-5 h-5" />
          <span>محاكي الحالات المرضية التفاعلي (Interactive Clinical Simulator)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          محاكاة الحالات الإكلينيكية وسيناريوهات التمريض
        </h2>
        <p className="text-slate-400 text-sm">
          اختبر مهاراتك وسرعة بديهتك في اتخاذ القرارات التمريضية العاجلة والحصول على تقييم فزيولوجي مباشر لرد فعل المريض.
        </p>
      </div>

      {/* Start Button if no case active */}
      {!currentCase && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-purple-950/30 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/30 shadow-lg shadow-pink-500/20">
            <Activity className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">ابدأ محاكاة حالة إكلينيكية حية</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              سيقوم الذكاء الاصطناعي بتوليد حالة طوارئ مرضية مفاجئة مع العلامات الحيوية الحية لتتدرب على اتخاذ القرارات التمريضية المناسبة.
            </p>
          </div>

          {/* Specialty Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block">اختر تخصص الحالة:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialty(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    specialty === s
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateCase}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-black text-base shadow-xl shadow-pink-600/30 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري إعداد الحالة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>توليد حالة جديدة بالذكاء الاصطناعي 🎲</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Active Clinical Case Box */}
      {currentCase && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-purple-950/30 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 mb-2">
                <Activity className="w-3.5 h-3.5 text-pink-400" />
                <span>سيناريو المحاكاة السريرية الحية</span>
              </div>
              <h3 className="text-2xl font-black text-white">{currentCase.caseTitle}</h3>
            </div>

            <button
              onClick={handleGenerateCase}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>حالة جديدة</span>
            </button>
          </div>

          {/* Vitals Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                <Heart className="w-5 h-5 animate-ping" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">العلامات الحيوية المباشرة (Live Vitals)</span>
                <span className="text-sm font-extrabold text-red-300 font-mono">{currentCase.vitals}</span>
              </div>
            </div>

            {currentCase.patientProfile && (
              <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-500/30">
                👤 {currentCase.patientProfile}
              </span>
            )}
          </div>

          {/* Description & Evaluation */}
          <div className="space-y-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">وصف وتطورات الحالة:</h4>
              <p className="text-slate-200 text-sm leading-relaxed">{currentCase.description}</p>
            </div>

            {currentCase.evaluation && (
              <div className="bg-purple-950/40 p-5 rounded-2xl border border-purple-500/40 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> تقييم الذكاء الاصطناعي لقرارك التمريضي:
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed">{currentCase.evaluation}</p>
              </div>
            )}
          </div>

          {/* Case History Timeline */}
          {caseHistory.length > 0 && (
            <details className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 space-y-1">
              <summary className="text-xs font-bold text-slate-400 cursor-pointer select-none">
                سجل القرارات والتقييمات السابقة ({caseHistory.filter((h) => h.role === 'action').length} إجراء)
              </summary>
              <div className="pt-3 space-y-2">
                {caseHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`text-xs leading-relaxed rounded-xl p-3 ${
                      entry.role === 'action'
                        ? 'bg-pink-950/30 text-pink-200 border border-pink-500/20'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span className="font-bold ml-1">{entry.role === 'action' ? '🩺 الإجراء:' : '📋 التقييم:'}</span>
                    {entry.text}
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Decision Options */}
          {!currentCase.isResolved ? (
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-extrabold text-white">اختر الإجراء التمريضي القادم المقترح:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentCase.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleTakeAction(opt)}
                    className="p-4 rounded-2xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-right text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>

              {/* Custom Action Input */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  placeholder="أو اكتب إجابتك/إجراءك التمريضي الخاص هنا..."
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-pink-400 focus:outline-none"
                />
                <button
                  onClick={() => handleTakeAction(customAction)}
                  disabled={loading || !customAction.trim()}
                  className="px-5 py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>تنفيذ الإجراء</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
              <span className="text-3xl">🎉</span>
              <h4 className="text-lg font-black text-emerald-300">تم استقرار حالة المريض بنجاح!</h4>
              <p className="text-xs text-slate-300">أحسنت، لقد اتخذت التدخلات التمريضية المناسبة وفق الأصول الإكلينيكية.</p>
              <button
                onClick={handleGenerateCase}
                className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>حالة تمريضية جديدة</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
