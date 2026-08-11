import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Loader2, Copy, Check, Trash2, Save, AlertCircle, Send } from 'lucide-react';
import { SbarReport } from '../types';
import { askPuterAI } from '../lib/puterAi';

export const HandoverSection: React.FC = () => {
  const [notesText, setNotesText] = useState('');
  const [sbarReport, setSbarReport] = useState<SbarReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveAlert, setSaveAlert] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nursawy_handover');
    if (saved) {
      setNotesText(saved);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotesText(val);
    localStorage.setItem('nursawy_handover', val);
  };

  const handleManualSave = () => {
    localStorage.setItem('nursawy_handover', notesText);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الملاحظات؟')) {
      setNotesText('');
      setSbarReport(null);
      localStorage.removeItem('nursawy_handover');
    }
  };

  const handleGenerateSbar = async () => {
    if (!notesText.trim()) {
      alert('يرجى كتابة بعض الملاحظات والشيفت أولاً للتحويل إلى SBAR.');
      return;
    }

    setLoading(true);
    setSbarReport(null);

    try {
      const systemPrompt = `أنت خبير إشراف تمريضي بالرعاية المركزة والطوارئ تساعد في تنظيم تسليم المناوبات بأسلوب SBAR المعتمد عالمياً.
رد بصيغة JSON فقط بالمفاتيح التالية بالضبط:
{
  "situation": "S - الوضع الحالي المباشر للمريض",
  "background": "B - الخلفية المرضية وتاريخ الحالة",
  "assessment": "A - التقييم الإكلينيكي والعلامات الحيوية",
  "recommendation": "R - التوصيات للمناوبة التالية",
  "urgentNotes": "ملاحظات وتنبيهات حاسمة"
}`;

      const raw = await askPuterAI(systemPrompt, `حوّل ملاحظات المناوبة التالية إلى تقرير SBAR:\n\n${notesText.trim()}`, true);
      const data = JSON.parse(raw);
      setSbarReport(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء توليد تقرير SBAR بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySbar = () => {
    if (!sbarReport) return;
    const textToCopy = `📋 **تقرير تسليم المناوبة (SBAR Report)**
------------------------------------
🔴 **S - Situation (الوضع الحالي):**
${sbarReport.situation}

🟡 **B - Background (الخلفية المرضية):**
${sbarReport.background}

🔵 **A - Assessment (التقييم الإكلينيكي):**
${sbarReport.assessment}

🟢 **R - Recommendation (التوصيات):**
${sbarReport.recommendation}

${sbarReport.urgentNotes ? `⚠️ **ملاحظات حاسمة:**\n${sbarReport.urgentNotes}` : ''}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <FileText className="w-5 h-5" />
          <span>دفتر تسليم المناوبات ببروتوكول SBAR والمعايير الدولية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          تسليم المناوبات التمريضية بـ SBAR الذكي
        </h2>
        <p className="text-slate-400 text-sm">
          سجّل ملاحظات المرضى بحرية، وحوّلها بنقرة زر إلى تقرير قياسي منظّم (SBAR) لتسليم الشيفت بدقة وبدون أخطاء.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Notes Input Column */}
        <div className="lg:col-span-6 bg-slate-900 border border-purple-500/20 rounded-3xl p-6 space-y-4 shadow-xl shadow-purple-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>ملاحظات الشيفت والمتابعة (تُحفظ تلقائياً)</span>
            </h3>

            {saveAlert && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                <Check className="w-4 h-4" /> تم الحفظ
              </span>
            )}
          </div>

          <textarea
            rows={10}
            value={notesText}
            onChange={handleTextChange}
            placeholder="اكتب ملاحظات المرضى هنا (مثال: مريض سرير 4 ضغطه كان عالي وخد كابوتين الساعة 3، مريض سرير 7 محتاج كيس دم جديد الساعة 6 وسكره اتظبط، مريض سرير 2 خارج عمليات ويحتاج متابعة النزيف)..."
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm leading-relaxed font-medium focus:border-cyan-400 focus:outline-none resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>حفظ يدوياً</span>
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>مسح</span>
              </button>
            </div>

            <button
              onClick={handleGenerateSbar}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الصياغة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>تحويل لتقرير SBAR بالذكاء الاصطناعي 📝</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SBAR Output Report Column */}
        <div className="lg:col-span-6 space-y-4">
          {!sbarReport ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3 min-h-[350px] flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm font-medium">
                اكتب الملاحظات واضغط على زر "تحويل لتقرير SBAR بالذكاء الاصطناعي" لعرض التسليم المنظم هنا.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-purple-950/20 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>تقرير تسليم SBAR المعتمد</span>
                </h3>

                <button
                  onClick={handleCopySbar}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-extrabold transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ التقرير'}</span>
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* S */}
                <div className="bg-slate-950 p-4 rounded-2xl border-r-4 border-red-500 space-y-1">
                  <span className="text-xs font-black text-red-400 block uppercase">
                    S - Situation (الوضع الحالي المباشر)
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">{sbarReport.situation}</p>
                </div>

                {/* B */}
                <div className="bg-slate-950 p-4 rounded-2xl border-r-4 border-amber-500 space-y-1">
                  <span className="text-xs font-black text-amber-400 block uppercase">
                    B - Background (الخلفية المرضية)
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">{sbarReport.background}</p>
                </div>

                {/* A */}
                <div className="bg-slate-950 p-4 rounded-2xl border-r-4 border-cyan-500 space-y-1">
                  <span className="text-xs font-black text-cyan-400 block uppercase">
                    A - Assessment (التقييم الإكلينيكي والعلامات)
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">{sbarReport.assessment}</p>
                </div>

                {/* R */}
                <div className="bg-slate-950 p-4 rounded-2xl border-r-4 border-emerald-500 space-y-1">
                  <span className="text-xs font-black text-emerald-400 block uppercase">
                    R - Recommendation (التوصيات والأدوية المتبقية)
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">{sbarReport.recommendation}</p>
                </div>

                {/* Urgent Notes */}
                {sbarReport.urgentNotes && (
                  <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-2xl text-red-200 space-y-1">
                    <span className="text-xs font-black text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> ملاحظات حاسمة وتنبيه طارئ
                    </span>
                    <p className="text-xs leading-relaxed font-medium">{sbarReport.urgentNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
