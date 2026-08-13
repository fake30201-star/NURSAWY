import React, { useMemo, useState } from 'react';
import {
  Pill,
  FlaskConical,
  ClipboardList,
  ShieldAlert,
  Skull,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  DRUG_COMPATIBILITY_GUIDE,
  LAB_VALUES_GUIDE,
  DIAGNOSTIC_PREP_GUIDE,
  INFECTION_CONTROL_GUIDE,
  TOXICOLOGY_GUIDE,
} from '../data/clinicalGuidesData';

type GuideId = 'compat' | 'labs' | 'diagnostic' | 'isolation' | 'toxicology';

const GUIDES: { id: GuideId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'compat', label: 'التفاعلات الدوائية 💉', icon: <ArrowRightLeft className="w-4 h-4" />, color: 'purple' },
  { id: 'labs', label: 'مفسر التحاليل 🧪', icon: <FlaskConical className="w-4 h-4" />, color: 'cyan' },
  { id: 'diagnostic', label: 'التجهيز للفحوصات 📋', icon: <ClipboardList className="w-4 h-4" />, color: 'emerald' },
  { id: 'isolation', label: 'العزل ومكافحة العدوى 🦠', icon: <ShieldAlert className="w-4 h-4" />, color: 'amber' },
  { id: 'toxicology', label: 'التسمم والجرعات الزائدة ☠️', icon: <Skull className="w-4 h-4" />, color: 'red' },
];

const statusBadge: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  compatible: { label: 'متوافق', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  incompatible: { label: 'ممنوع الخلط', cls: 'bg-red-500/15 text-red-300 border-red-500/30', icon: <XCircle className="w-3.5 h-3.5" /> },
  caution: { label: 'يستلزم حذر', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export const ClinicalGuidesSection: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<GuideId>('compat');
  const [query, setQuery] = useState('');

  const filteredCompat = useMemo(
    () =>
      DRUG_COMPATIBILITY_GUIDE.filter((e) =>
        `${e.drugA} ${e.drugB} ${e.notes}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  const filteredLabs = useMemo(
    () => LAB_VALUES_GUIDE.filter((e) => `${e.test} ${e.category}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const filteredDx = useMemo(
    () => DIAGNOSTIC_PREP_GUIDE.filter((e) => `${e.procedure} ${e.category}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const filteredIso = useMemo(
    () => INFECTION_CONTROL_GUIDE.filter((e) => `${e.type} ${e.typeEn} ${e.examples}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const filteredTox = useMemo(
    () => TOXICOLOGY_GUIDE.filter((e) => `${e.agent} ${e.category}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="space-y-6 dir-rtl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">الأدلة والأدوات السريرية المتقدمة</h2>
            <p className="text-xs sm:text-sm text-slate-400">مراجع سريعة عند السرير: التفاعلات الدوائية، التحاليل، التجهيز للفحوصات، العزل، والتسمم.</p>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
          {GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGuide(g.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeGuide === g.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {g.icon}
              {g.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في الدليل..."
            className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium focus:border-purple-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 1) Drug Compatibility */}
      {activeGuide === 'compat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCompat.map((e) => (
            <div key={e.id} className="bg-slate-900/90 border border-purple-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-extrabold text-white text-sm">
                  {e.drugA} <span className="text-slate-500">×</span> {e.drugB}
                </h3>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge[e.status].cls}`}>
                  {statusBadge[e.status].icon}
                  {statusBadge[e.status].label}
                </span>
              </div>
              <p className="text-[11px] text-cyan-300 font-bold">{e.route}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{e.notes}</p>
            </div>
          ))}
          {filteredCompat.length === 0 && <EmptyState />}
        </div>
      )}

      {/* 2) Lab Values */}
      {activeGuide === 'labs' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredLabs.map((e) => (
            <div key={e.id} className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-sm">{e.test}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {e.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">المعدل الطبيعي:</strong> {e.normalRange}
              </p>
              <p className="text-xs text-amber-300">
                <strong>عند الارتفاع:</strong> <span className="text-slate-300">{e.highMeaning}</span>
              </p>
              <p className="text-xs text-sky-300">
                <strong>عند الانخفاض:</strong> <span className="text-slate-300">{e.lowMeaning}</span>
              </p>
              <p className="text-xs bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2 text-red-300">
                <strong>إجراء طارئ:</strong> {e.criticalAction}
              </p>
            </div>
          ))}
          {filteredLabs.length === 0 && <EmptyState />}
        </div>
      )}

      {/* 3) Diagnostic Prep */}
      {activeGuide === 'diagnostic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDx.map((e) => (
            <div key={e.id} className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-extrabold text-white text-sm">{e.procedure}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {e.category}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-cyan-300 mb-1">قبل الإجراء</p>
                <ul className="space-y-1">
                  {e.beforeCare.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold text-purple-300 mb-1">بعد الإجراء</p>
                <ul className="space-y-1">
                  {e.afterCare.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2 text-red-300">
                ⚠️ {e.alerts}
              </p>
            </div>
          ))}
          {filteredDx.length === 0 && <EmptyState />}
        </div>
      )}

      {/* 4) Infection Control */}
      {activeGuide === 'isolation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredIso.map((e) => (
            <div key={e.id} className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 space-y-3">
              <h3 className="font-extrabold text-white text-sm">
                {e.type} <span className="text-slate-500 font-mono text-[11px]">({e.typeEn})</span>
              </h3>
              <p className="text-xs text-slate-400"><strong className="text-slate-200">أمثلة:</strong> {e.examples}</p>
              <div className="flex flex-wrap gap-1.5">
                {e.ppe.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-300"><strong className="text-cyan-300">تجهيز الغرفة:</strong> {e.roomSetup}</p>
              <div>
                <p className="text-[11px] font-bold text-red-300 mb-1">ترتيب خلع المهمات الوقائية</p>
                <ol className="space-y-1 list-decimal list-inside">
                  {e.doffingOrder.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300">{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
          {filteredIso.length === 0 && <EmptyState />}
        </div>
      )}

      {/* 5) Toxicology */}
      {activeGuide === 'toxicology' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTox.map((e) => (
            <div key={e.id} className="bg-slate-900/90 border border-red-500/20 rounded-2xl p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-extrabold text-white text-sm">{e.agent}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                  {e.category}
                </span>
              </div>
              <p className="text-xs text-slate-300"><strong className="text-amber-300">الأعراض:</strong> {e.symptoms}</p>
              <p className="text-xs text-slate-300"><strong className="text-cyan-300">الإجراء الفوري:</strong> {e.immediateAction}</p>
              <p className="text-xs bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-emerald-300">
                <strong>الترياق:</strong> {e.antidote}
              </p>
            </div>
          ))}
          {filteredTox.length === 0 && <EmptyState />}
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="col-span-full text-center py-10 text-slate-500 text-sm">لا توجد نتائج مطابقة للبحث.</div>
);
