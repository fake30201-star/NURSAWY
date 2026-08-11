import React, { useState } from 'react';
import { Search, Sparkles, Loader2, AlertCircle, CheckCircle2, Pill, ShieldAlert, BookOpen, Stethoscope, HeartPulse } from 'lucide-react';
import { STATIC_TERMS } from '../data/clinicalData';
import { ClinicalQueryResponse } from '../types';
import { askPuterAI } from '../lib/puterAi';

export const AiDictionarySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<ClinicalQueryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter static terms
  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'الأدوية والعلاجيات', label: 'الأدوية والجرعات' },
    { id: 'العلامات الحيوية', label: 'العلامات الحيوية' },
    { id: 'التحاليل الطبية', label: 'التحاليل والفحوصات' },
    { id: 'أقسام المستشفيات', label: 'الطوارئ والأقسام' },
  ];

  const filteredStaticTerms = STATIC_TERMS.filter((term) => {
    const matchesCategory = activeCategory === 'all' || term.category.includes(activeCategory);
    const matchesSearch =
      !searchTerm.trim() ||
      term.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) {
      setErrorMsg('يرجى كتابة اسم الدواء، المرض، أو العرض للبحث عبر الذكاء الاصطناعي.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setAiResult(null);

    try {
      const systemPrompt = `أنت المساعد الطبي والإكلينيكي التمريضي الذكي لمنصة Nursawy.
بصفتك استشارياً في التمريض الإكلينيكي والعناية المركزة والطوارئ، قدم تقريراً طبياً وتمريضياً دقيقاً باللغة العربية عن المصطلح أو الدواء أو العرض المطلوب.

رد بصيغة JSON فقط بالمفاتيح التالية بالضبط:
{
  "nameAr": "الاسم بالعربية",
  "nameEn": "الاسم الإنجليزي/العلمي",
  "category": "التصنيف الطبي",
  "definition": "الوصف والآلية المرضية",
  "symptomsAndSigns": "الأعراض والمؤشرات الإكلينيكية",
  "nursingCarePlan": ["خطوة 1", "خطوة 2"],
  "dosagesAndPrecautions": "الجرعات والمحاذير إن وُجدت",
  "criticalAlert": "تنبيه إكلينيكي عاجل للحالات الحرجة"
}`;

      const raw = await askPuterAI(systemPrompt, searchTerm.trim(), true);
      const data = JSON.parse(raw);
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي الإكلينيكية.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Stethoscope className="w-5 h-5" />
          <span>المساعد الطبي الإكلينيكي بالذكاء الاصطناعي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          القاموس والتشخيص السريري الأونلاين
        </h2>
        <p className="text-slate-400 text-sm">
          ابحث عن أي مصطلح، دواء، عرض (مثل: صداع، سخونية، ضغط، سكر، مغص)، أو تحليل للوصول الفوري لتقرير تمريضي شامل بالذكاء الاصطناعي.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-xl shadow-purple-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب اسم دواء، عرض، أو تحليل (مثل: Paracetamol, insulin, سخونية, ضغط, ABG)..."
              className="w-full pr-12 pl-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm sm:text-base font-medium focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <button
            onClick={handleAiSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحليل...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>بحث بالذكاء الاصطناعي 🔍</span>
              </>
            )}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 ml-2">التصنيفات السريعة:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI Dynamic Clinical Report Card */}
      {aiResult && (
        <div className="bg-slate-900 border-2 border-cyan-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 space-y-6 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>تقرير الذكاء الاصطناعي الأونلاين - {aiResult.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <span>{aiResult.nameAr}</span>
                <span className="text-sm sm:text-lg font-mono text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-lg border border-cyan-500/20">
                  {aiResult.nameEn}
                </span>
              </h3>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-2 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>الوصف والآلية المرضية (Pathophysiology & Definition):</span>
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">{aiResult.definition}</p>
          </div>

          {/* Symptoms & Signs if present */}
          {aiResult.symptomsAndSigns && (
            <div className="space-y-2 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                <span>الأعراض والمؤشرات الإكلينيكية (Clinical Presentation):</span>
              </h4>
              <p className="text-slate-200 text-sm leading-relaxed">{aiResult.symptomsAndSigns}</p>
            </div>
          )}

          {/* Nursing Care Plan Checklist */}
          {aiResult.nursingCarePlan && aiResult.nursingCarePlan.length > 0 && (
            <div className="space-y-3 bg-purple-950/20 border border-purple-500/30 p-5 rounded-2xl">
              <h4 className="text-sm font-extrabold text-purple-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>خطة الرعاية والتدخلات التمريضية المعتمدة (Nursing Care Plan):</span>
              </h4>
              <ul className="space-y-2">
                {aiResult.nursingCarePlan.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm leading-snug">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dosages & Precautions if present */}
          {aiResult.dosagesAndPrecautions && (
            <div className="space-y-2 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                <span>الجرعات والاحتياطات والآثار الجانبية (Dosage & Precautions):</span>
              </h4>
              <p className="text-slate-200 text-sm leading-relaxed">{aiResult.dosagesAndPrecautions}</p>
            </div>
          )}

          {/* Critical Alert Red Flag Banner */}
          {aiResult.criticalAlert && (
            <div className="p-4 sm:p-5 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-200 space-y-1 shadow-lg shadow-red-950/30">
              <div className="flex items-center gap-2 font-black text-red-400 text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>تنبيه طوارئ إكلينيكي حرج (Red Flag Alert)</span>
              </div>
              <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-medium">
                {aiResult.criticalAlert}
              </p>
            </div>
          )}

          {/* Clinical Disclaimer */}
          <div className="text-center text-[11px] text-slate-500 border-t border-slate-800 pt-3">
            ⚠️ تنبيه إكلينيكي: المعلومات المعروضة ناتجة عن نماذج الذكاء الاصطناعي المتقدمة بغرض الدعم التمريضي والتعليم الإكلينيكي ولا تستبدل التقييم الطبي المباشر.
          </div>
        </div>
      )}

      {/* Pre-populated Static Term Cards */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <span>دليل المصطلحات والأدوية السريعة</span>
          <span className="text-xs font-normal text-slate-500">({filteredStaticTerms.length} مصطلح)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStaticTerms.map((term, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-cyan-500/40 hover:bg-slate-850 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-cyan-300 text-base">{term.nameAr}</h4>
                  <p className="text-xs font-mono text-slate-400">{term.nameEn}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {term.category}
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {term.definition}
              </p>

              <div className="pt-2 border-t border-slate-800 text-xs text-purple-200/90 flex items-start gap-2">
                <span className="font-bold text-cyan-400 shrink-0">تمريضياً:</span>
                <span>{term.nursingCare}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
