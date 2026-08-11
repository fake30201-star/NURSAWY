import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Heart,
  Zap,
  Flame,
  ShieldAlert,
  Play,
  Square,
  RefreshCw,
  Volume2,
  Activity,
  Brain,
  Droplet,
  Pill,
  Sparkles,
  Search,
  CheckCircle2,
  Bandage,
  Skull
} from 'lucide-react';

export const EmergencySection: React.FC = () => {
  // CPR Metronome State
  const [cprActive, setCprActive] = useState(false);
  const [cprCount, setCprCount] = useState(0);

  // Category Filter
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    let interval: any = null;
    if (cprActive) {
      // 110 beats per minute -> interval ~ 545ms
      interval = setInterval(() => {
        setCprCount((prev) => (prev >= 30 ? 1 : prev + 1));
      }, 545);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [cprActive]);

  const categories = [
    { id: 'all', label: 'جميع البروتوكولات' },
    { id: 'cardiac', label: 'كود بلو والقلب ❤️' },
    { id: 'respiratory', label: 'التنفس والمجرى الهوائي 🫁' },
    { id: 'neuro', label: 'المخ والتشنجات 🧠' },
    { id: 'trauma', label: 'النزيف والصدمات 🩸' },
    { id: 'meds', label: 'أدوية ترولي الطوارئ Crash Cart 💊' },
  ];

  const emergencyProtocols = [
    {
      id: 'cpr-acls',
      category: 'cardiac',
      icon: <Heart className="w-6 h-6 text-red-400" />,
      title: '1. الإنعاش القلبي الرئوي المتقدم (CPR & ACLS - Code Blue)',
      description: 'البروتوكول الشامل لتوقف القلب والتنفس المفاجئ وفق توصيات جمعية القلب الأمريكية (AHA).',
      steps: [
        'تأكد من أمان المكان وتقييم الاستجابة والوعي (Tap & Shout) وفحص النبض السباتي والتنفس خلال 10 ثوانٍ.',
        'طلب المساعدة فوراً وإعلان كود بلو (Code Blue / فريق الإنعاش) وطلب جهاز الصدمات الـ AED وتجهيز ترولي الطوارئ.',
        'بدء الضغطات الصدرية فوراً بمعدل 100-120 ضغطة/دقيقة بعمق 5-6 سم بصدر البالغين على سطح صلب.',
        'إعطاء 2 تنفس صناعي بعد كل 30 ضغطة صدرية (30:2) أو تنفس مستمر كل 6 ثوانٍ حال وضع أنبوب حنجري (Endotracheal Tube).',
        'إعطاء حقنة الأدرينالين (Epinephrine 1mg IV/IO) كل 3-5 دقائق متواصلة أثناء الإنعاش المستمر.',
        'في نظم VF/pVT القابل للصدمة: إعطاء صدمة ثم Amiodarone 300mg IV بعد الصدمة الثالثة ثم 150mg.'
      ]
    },
    {
      id: 'aed-defib',
      category: 'cardiac',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: '2. جهاز الصدمات الكهربائية ونظم القلب (AED & Defibrillation)',
      description: 'التعامل مع اضطرابات نظم القلب القابلة للصدمة وغير القابلة للصدمة.',
      steps: [
        'تشغيل جهاز الـ AED فور وصوله وتجفيف صدر المريض ونزع أي مجوهرات أو لاصقات طبية.',
        'تثبيت أقطاب الصدمات (Pads) على أعلى الصدر الأيمن (Sternum) وجانب الصدر الأيسر (Apex).',
        'الابتعاد التام عن المريض أثناء تحليل نظم القلب (Analyzing Rhythm) والتأكد من عدم ملامسة السرير.',
        'إذا كان النظم قابلاً للصدمة (VF / Pulseless VT): تأكد من عدم ملامسة أحد واضغط زر الصدمة (SHOCK).',
        'إذا كان النظم غير قابل للصدمة (Asystole / PEA): استأنف الضغطات الصدرية (CPR) فوراً لمدة دقيقتين.',
        'إعادة فحص النبض والنظم كل دقيقتين وتقليل زمن توقف الضغطات إلى أقل من 10 ثوانٍ.'
      ]
    },
    {
      id: 'anaphylaxis',
      category: 'respiratory',
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      title: '3. صدمة الحساسية المفرطة وتأمين مجرى الهواء (Anaphylaxis)',
      description: 'الرد الفوري على رد الفعل التحسسي الحاد المهدد للحياة والتورم الوعائي.',
      steps: [
        'إيقاف إعطاء أي دواء أو نقل دم أو سائل مسبب للحساسية فوراً وتأمين مجرى الهواء (Airway).',
        'حقن الأبينفرين (Epinephrine 0.3-0.5mg IM 1:1000) بالجهة الخارجية لعضلة الفخذ (Mid-outer Thigh) فوراً وتكراره كل 5-15 دقيقة عند الحاجة.',
        'وضع المريض مستلقياً على ظهره مع رفع القدمين (Trendelenburg) لتعزيز التروية الدموية.',
        'إعطاء أكسجين عالي التدفق (10-15 L/min) ببرطمان قناع عدم إعادة التنفس (Non-Rebreather Mask).',
        'بدء محاليل الصوديوم كلورايد 0.9% سريعة (Normal Saline 1-2 Liters Bolus) لتعويض هبوط الضغط.',
        'إعطاء هيدروكورتيزون (Hydrocortisone 200mg IV) ومضاد الهستامين (Antihistamine IV).'
      ]
    },
    {
      id: 'choking',
      category: 'respiratory',
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      title: '4. انسداد مجرى الهواء والاختناق (Choking / Heimlich Maneuver)',
      description: 'إزالة الأجسام الغريبة من القصبة الهوائية وتفادي التوقف التنفسي.',
      steps: [
        'تقييم قدرة المريض على السعال أو الكلام: السعال الفعال يُشجع عليه دون ملامسة المريض.',
        'في الانسداد التام (عدم القدرة على التنفس أو الكلام): الوقوف خلف المريض وإحاطة خصره باليدين.',
        'وضع قبضة اليد فوق السرة مباشرة والضغط للداخل وللأعلى بقوة وسرعة (Heimlich Maneuver).',
        'تكرار الضغطات حتى خروج الجسم الغريب أو فقدان المريض للوعي.',
        'في حال فقدان الوعي: إنزال المريض أرضاً ببطء وبدء الإنعاش القلبي الرئوي (CPR) والبحث بالعين باللسان دون إدخال الإصبع عشوائياً.'
      ]
    },
    {
      id: 'stroke-fast',
      category: 'neuro',
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      title: '5. التقييم العاجل للجلطة الدماغية (Acute Stroke - FAST Protocol)',
      description: 'البروتوكول السريع للاشتباه بالجلطة الدماغية وملافاة التلف العصبي الدائم.',
      steps: [
        'تطبيق اختبار FAST الفوري: F (Face drooping - انحراف الوجه) | A (Arm weakness - ضعف الذراع) | S (Speech difficulty - ثقل الكلام) | T (Time to call - الوقت حاسم).',
        'تسجيل دقيق لساعة بداية الأعراض (Last Known Normal Time) لأن خيار تذويب الجلطة (tPA) مشروط بأول 4.5 ساعة.',
        'قياس عاجل لسكر الدم فوراً بنقطة الدم لإستبعاد هبوط السكر (Hypoglycemia Mimic).',
        'تأمين مجرى الهواء وإعطاء الأكسجين إذا كانت نسبة SpO2 أقل من 94%.',
        'إجراء أشعة مقطعية عاجلة للمخ (CT Brain non-contrast) لنفي النزيف الدماغي قبل إعطاء أي مذيبات للجلطة.'
      ]
    },
    {
      id: 'hemorrhage-shock',
      category: 'trauma',
      icon: <Droplet className="w-6 h-6 text-red-500" />,
      title: '6. السيطرة على النزيف الحاد والصدمة النزفية (Severe Hemorrhage)',
      description: 'التعامل التمريضي الطارئ مع النزيف الخارجي الحاد والسيطرة على الصدمة النزفية.',
      steps: [
        'الضغط المباشر القوي والمستمر على مكان النزيف باستخدام ضمادات معقمة وعدم رفع الضماد الأول.',
        'استخدام الرباط الضاغط الشرياني (Tourniquet) أعلى مكان الجرح بـ 5-7 سم في نزيف الأطراف الحاد المهدد للحياة وتسجيل وقت التربيط.',
        'ركب 2 كانيولا وريدية واسعة النطاق (Large-bore IV Cannulas 14G / 16G) فوراً.',
        'بدء محاليل دافئة سريعة (Warm Normal Saline / Ringer Ringer) وسحب عينة لمطابقة فصيلة الدم (Cross-matching).',
        'تجهيز نقل الدم الشامل وتطبيق بروتوكول نقل الدم الضخم (Massive Transfusion Protocol - MTP).'
      ]
    },
    {
      id: 'seizure-status',
      category: 'neuro',
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      title: '7. التعامل مع نوبات الصرع والتشنجات (Status Epilepticus)',
      description: 'حماية المريض أثناء التشنج والسيطرة الدوائية على الصرع المستمر.',
      steps: [
        'تأمين بيئة المريض وحمايته من السقوط والإصابات وإبعاد الأجسام الصلبة والأنبوبة (لا تضع أي شيء داخل فم المريض أبداً).',
        'توجيه رأس المريض جانباً (Recovery Position) لمنع الاختناق باللعاب أو القيء.',
        'حساب وقت بداية ونهاية النوبة الشديدة بالدقائق.',
        'إعطاء أكسجين عالي التدفق وإيقاف التشنج بـ (Diazepam 10mg IV/Rectal) أو (Midazolam 5-10mg IM/IV) إذا استمر التشنج لأكثر من 5 دقائق.',
        'فحص سكر الدم الفوري وإعطاء الجلوكوز الوريدي حال وجود هبوط بسكر الدم.'
      ]
    },
    {
      id: 'hypoglycemia-coma',
      category: 'trauma',
      icon: <Skull className="w-6 h-6 text-emerald-400" />,
      title: '8. هبوط السكر الحاد والغيبوبة السكرية (Severe Hypoglycemia)',
      description: 'الإنقاذ العاجل لهبوط سكر الدم الشديد دون 70 mg/dL.',
      steps: [
        'قياس سكر الدم الفوري بالجهاز المحمول للتحقق من انخفاض القراءة عن 70 mg/dL.',
        'إذا كان المريض واعياً وقادراً على البلع: إعطاء 15-20 جرام كربوهيدرات سريعة (عصير سكري، 4 أقراص جلوكوز) وإعادة الفحص بعد 15 دقيقة.',
        'إذا كان المريض فاقداً للوعي أو غير قادر على البلع: يمنع إعطاء أي شيء بالفم إطلاقاً.',
        'تركيب IV وعطاء جلوكوز مركز وريدي (Dextrose 10% / 25% / 50% 50ml IV Push) ببطء شديد عبر وريد كبير.',
        'في حال تعذر الوصول الوريدي: إعطاء حقنة الجلوكاجون (Glucagon 1mg IM/SubQ) بالعضل.',
        'متابعة قياس السكر كل 15 دقيقة حتى يستقر فوق 100 mg/dL.'
      ]
    }
  ];

  const crashCartMeds = [
    {
      name: 'Epinephrine (Adrenaline)',
      dose: '1 mg IV/IO (1:10,000) كل 3-5 دقائق',
      indication: 'توقف القلب (CPR - Code Blue) والصدمة التحسسية الحادة (Anaphylaxis)',
      action: 'قابض للأوعية الدموية ومحفز عضلة القلب وموسع للقصبات.'
    },
    {
      name: 'Amiodarone (Cordarone)',
      dose: '300 mg IV Bolus ثم 150 mg',
      indication: 'الرجفان البطيني (VF) والتسرع البطيني الخالي من النبض (pVT)',
      action: 'مضاد لاضطرابات النظم القلبي البطيني الشديدة.'
    },
    {
      name: 'Atropine Sulfate',
      dose: '1 mg IV Push (حتى حد أقصى 3 mg)',
      indication: 'بطء نبضات القلب الحاد المسبب للهبوط (Symptomatic Bradycardia)',
      action: 'مضاد كولين يرفع معدل ضربات القلب.'
    },
    {
      name: 'Adenosine (Adenocard)',
      dose: '6 mg Rapid IV Push يعقبها 20ml Saline',
      indication: 'تسرع القلب فوق البطيني (SVT)',
      action: 'يبطئ التوصيل عبر العقدة الأذينية البطينية AV Node.'
    },
    {
      name: 'Hydrocortisone / Solu-Cortef',
      dose: '100 - 200 mg IV Push',
      indication: 'الصدمة التحسسية، أزمات الربو الحادة، وقصور الغدة الجرثومي',
      action: 'مضاد التهاب قوي ومثبط للتحسس الشديد.'
    },
    {
      name: 'Dextrose 50% / D50W',
      dose: '50 ml IV Slow Push',
      indication: 'غيبوبة وهبوط السكر الحاد (Severe Hypoglycemia)',
      action: 'رفع مستويات الجلوكوز بالدم فورا بالدوران.'
    },
    {
      name: 'Naloxone (Narcan)',
      dose: '0.4 - 2 mg IV/IM/Intranasal',
      indication: 'التسمم وزيادة جرعة المورفين والمخدرات (Opioid Overdose)',
      action: 'مضاد ومبطل لمستقبلات الأفيونيات بالدماغ.'
    },
    {
      name: 'Diazepam / Midazolam',
      dose: 'Diazepam 5-10mg IV / Midazolam 5mg IV',
      indication: 'نوبات التشنج والصرع المستمر (Status Epilepticus)',
      action: 'مهدئ ومسترد للجهاز العصبي المركزي.'
    }
  ];

  const filteredProtocols = emergencyProtocols.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch =
      !searchFilter.trim() ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.steps.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 dir-rtl">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>بروتوكولات الطوارئ والحالات الحرجة الشاملة (Code Blue & Critical Care)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          دليل بروتوكولات الطوارئ وأدوية الإنعاش (Crash Cart)
        </h2>
        <p className="text-slate-400 text-sm">
          دليل مرجعي شامل وموسع للتعامل السريع مع توقف القلب، الجلطات الدماغية، الصدمات النزفية، التشنجات، وأدوية ترولي الإنعاش.
        </p>
      </div>

      {/* CPR Metronome Interactive Widget */}
      <div className="bg-slate-900 border-2 border-red-500/40 rounded-3xl p-6 shadow-xl shadow-red-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            <span>عداد إيقاع الضغطات الصدرية (110 ضغطة/دقيقة)</span>
          </span>
          <h3 className="text-xl font-extrabold text-white">
            مساعد ضغطات الـ CPR الميداني
          </h3>
          <p className="text-xs text-slate-300">
            حافظ على إيقاع 30 ضغطة صدرية متتالية يعقبها تنفسين صناعيين.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`text-4xl sm:text-5xl font-black ${cprCount === 30 ? 'text-amber-400 animate-ping' : 'text-red-400'}`}>
              {cprCount} / 30
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {cprCount === 30 ? '⚠️ أوقف الضغط وأعطِ تنفسين!' : 'ضغطة صدرية'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!cprActive ? (
              <button
                onClick={() => setCprActive(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>تشغيل العداد</span>
              </button>
            ) : (
              <button
                onClick={() => setCprActive(false)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm hover:bg-slate-700 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-slate-200" />
                <span>إيقاف</span>
              </button>
            )}

            <button
              onClick={() => {
                setCprActive(false);
                setCprCount(0);
              }}
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="إعادة ضبط"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-purple-500/20">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCat === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="البحث بالبروتوكولات والأدوية..."
              className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium focus:border-red-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Emergency Protocols Grid */}
      {selectedCat !== 'meds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProtocols.map((protocol) => (
            <div
              key={protocol.id}
              className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 space-y-4 shadow-xl shadow-red-950/20 hover:border-red-500/50 transition-all"
            >
              <div className="flex items-start gap-3 border-b border-slate-800 pb-3">
                <div className="p-3 rounded-2xl bg-red-950/50 border border-red-500/30 shrink-0">
                  {protocol.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">{protocol.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{protocol.description}</p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {protocol.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Crash Cart Medications Reference Table */}
      {(selectedCat === 'all' || selectedCat === 'meds') && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-amber-950/20">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">دليل أدوية ترولي الإنعاش الحرجة (Crash Cart Medication Checklist)</h3>
              <p className="text-xs text-slate-400">الجرعات المعتمدة ودواعي الاستعمال السريع للحالات الطارئة بصالة الإنعاش.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crashCartMeds.map((med, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-amber-300 text-sm sm:text-base font-mono">{med.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30">
                    طوارئ
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-slate-200">
                    <strong className="text-cyan-400">الجرعة القياسية:</strong> {med.dose}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-purple-300">دواعي الاستعمال:</strong> {med.indication}
                  </p>
                  <p className="text-slate-400 text-[11px] pt-1">
                    <strong className="text-slate-300">الآلية والنشاط:</strong> {med.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
