import React, { useState } from 'react';
import { Calculator, Sparkles, Loader2, ShieldCheck, AlertCircle, Droplets, Info } from 'lucide-react';
import { askPuterAI } from '../lib/puterAi';

export const DripCalculatorSection: React.FC = () => {
  const [volume, setVolume] = useState<number>(500);
  const [hours, setHours] = useState<number>(8);
  const [dropFactor, setDropFactor] = useState<number>(20);
  const [drugName, setDrugName] = useState<string>('');

  const [aiSafetyText, setAiSafetyText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculations
  const totalMinutes = Math.max(hours * 60, 1);
  const rateGttMin = Math.round((volume * dropFactor) / totalMinutes);
  const rateMlHr = Math.round((volume / Math.max(hours, 0.1)) * 10) / 10;

  const handleAiSafetyCheck = async () => {
    setLoading(true);
    setAiSafetyText(null);

    try {
      const systemPrompt = 'أنت صيدلي إكلينيكي واستشاري تمريض محاليل وريدية، قدم إرشادات أمان ومراقبة آثار جانبية باللغة العربية.';
      const prompt = `حجم المحلول: ${volume} مل، الوقت: ${hours} ساعة، معامل التقطير: ${dropFactor} قطرة/مل.
المعدل المحسوب: ${rateGttMin} قطرة/دقيقة (${rateMlHr} مل/ساعة).
${drugName.trim() ? `اسم الدواء أو المحلول: ${drugName.trim()}` : ''}

قدم تقييماً تمريضياً سريعاً وإرشادات الأمان لهذه الجرعة الإكلينيكية ومعدل التقطير باللغة العربية.`;

      const advice = await askPuterAI(systemPrompt, prompt, false);
      setAiSafetyText(advice);
    } catch (err: any) {
      console.error(err);
      setAiSafetyText('حدث خطأ أثناء إجراء فحص الأمان بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Calculator className="w-5 h-5" />
          <span>حاسبة المحاليل ومعدل التدفق الوريدي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          حاسبة تقطير المحاليل وإرشادات السلامة الإكلينيكية
        </h2>
        <p className="text-slate-400 text-sm">
          أدخل بيانات الحجم والمحلول للوصول الفوري لمعدل التدفق (Drops/min) وفحص معايير الأمان المباشرة بالذكاء الاصطناعي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-purple-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-purple-950/20">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <span>بيانات المحلول والجهاز الوريدي</span>
          </h3>

          <div className="space-y-4">
            {/* Volume */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2">
                حجم المحلول الإجمالي (مل - mL):
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-base focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Time in Hours */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2">
                الزمن المطلق لإعطاء المحلول (ساعات - Hours):
              </label>
              <input
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-base focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Drop Factor Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2">
                معامل جهاز التقطير (Drop Factor):
              </label>
              <select
                value={dropFactor}
                onChange={(e) => setDropFactor(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value={20}>جهاز عالي التقطير بالغين - Macro Drip (20 drops/mL)</option>
                <option value={60}>جهاز دقيق أطفال - Micro Drip Set (60 drops/mL)</option>
                <option value={15}>جهاز نقل دم ونقل بلازما - Blood Set (15 drops/mL)</option>
                <option value={10}>جهاز تقطير سريع - Heavy Macro (10 drops/mL)</option>
              </select>
            </div>

            {/* Optional Drug Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-2">
                اسم الدواء المضاف للمحلول (اختياري لفحص الأمان):
              </label>
              <input
                type="text"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                placeholder="مثال: Potassium Chloride, Dopamine, Oxytocin, Saline 0.9%..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-medium focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Check Button */}
          <button
            onClick={handleAiSafetyCheck}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري مطابقة دواعي الأمان...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>فحص أمان وملاءمة الجرعة بالذكاء الاصطناعي 🛡️</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output & Dripping Animation Column */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />

            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Droplets className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">معدل التقطير المطلق</span>
              <div className="text-5xl sm:text-6xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] my-1">
                {rateGttMin}
              </div>
              <span className="text-sm font-extrabold text-cyan-300">قطرة / دقيقة (gtt/min)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block">المعدل بالحجم:</span>
                <span className="font-bold text-white text-sm">{rateMlHr} mL/hr</span>
              </div>
              <div>
                <span className="text-slate-400 block">الزمن الإجمالي:</span>
                <span className="font-bold text-white text-sm">{hours} ساعة ({totalMinutes} دقيقة)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              لإعطاء حجم {volume} مل خلال {hours} ساعة باستخدام معامل {dropFactor} قطرة/مل، يتم ضبط الجهاز على {rateGttMin} قطرة/دقيقة.
            </p>
          </div>

          {/* AI Safety Output Box */}
          {aiSafetyText && (
            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 space-y-3 animate-in fade-in duration-300 shadow-xl shadow-purple-950/20">
              <h4 className="text-sm font-extrabold text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>تقرير أمان التدفق والسلامة التمريضية:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {aiSafetyText}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
