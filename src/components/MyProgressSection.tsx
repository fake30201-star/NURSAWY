import { AlertTriangle, Award, Calendar, CheckCircle2, Loader2, Sparkles, Star, Trash2, TrendingUp, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { OSCE_SKILLS } from '../data/clinicalData';

export const MyProgressSection: React.FC = () => {
  const { user, fullName, email, isSubscribed, deleteAccount } = useAuth();
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setDeleting(true);
    try {
      await deleteAccount();
      // بعد الحذف، الجلسة بتتقفل تلقائيًا وهيرجع لصفحة تسجيل الدخول
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'حصل خطأ غير متوقع');
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('osce_progress')
        .select('skill_id, completed_steps')
        .eq('user_id', user.id);

      const map: Record<string, number> = {};
      if (data) {
        for (const row of data) {
          const steps = row.completed_steps as boolean[];
          const skill = OSCE_SKILLS.find((s) => s.id === row.skill_id);
          const total = skill ? skill.steps.length : steps.length;
          const done = steps.filter(Boolean).length;
          map[row.skill_id] = total > 0 ? Math.round((done / total) * 100) : 0;
        }
      }
      setSkillProgress(map);
      setLoading(false);
    })();
  }, [user]);

  const overallPercent =
    OSCE_SKILLS.length > 0
      ? Math.round(
          OSCE_SKILLS.reduce((sum, s) => sum + (skillProgress[s.id] || 0), 0) / OSCE_SKILLS.length
        )
      : 0;

  const completedSkillsCount = OSCE_SKILLS.filter((s) => (skillProgress[s.id] || 0) === 100).length;
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 dir-rtl">
        <Loader2 className="w-6 h-6 animate-spin ml-2" /> جارِ تحميل تقدمك...
      </div>
    );
  }

  return (
    <div className="dir-rtl space-y-8">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[3px] shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-300">
            <User className="w-9 h-9" />
          </div>
        </div>
        <div className="text-center sm:text-right flex-1">
          <h2 className="text-xl font-extrabold text-white">{fullName || email}</h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <Calendar className="w-3.5 h-3.5" /> عضو منذ {joinDate}
          </p>
          {isSubscribed && (
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Star className="w-3 h-3" /> مشترك
            </span>
          )}
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-cyan-300">{overallPercent}%</div>
          <p className="text-xs text-slate-400">إجمالي التقدم</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-cyan-400" />
          <div>
            <p className="text-xl font-extrabold text-white">{overallPercent}%</p>
            <p className="text-[11px] text-slate-400">نسبة الإنجاز الكلية</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <Award className="w-7 h-7 text-emerald-400" />
          <div>
            <p className="text-xl font-extrabold text-white">{completedSkillsCount} / {OSCE_SKILLS.length}</p>
            <p className="text-[11px] text-slate-400">مهارات مكتملة 100%</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3 col-span-2 sm:col-span-1">
          <Sparkles className="w-7 h-7 text-purple-400" />
          <div>
            <p className="text-xl font-extrabold text-white">{OSCE_SKILLS.length}</p>
            <p className="text-[11px] text-slate-400">إجمالي المهارات المتاحة</p>
          </div>
        </div>
      </div>

      {/* Per-skill breakdown */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h3 className="font-bold text-white text-sm">تقدمك في كل مهارة</h3>
        </div>
        <div className="divide-y divide-purple-500/5">
          {OSCE_SKILLS.map((skill) => {
            const percent = skillProgress[skill.id] || 0;
            const isComplete = percent === 100;
            return (
              <div key={skill.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <p className="text-sm font-bold text-slate-200 truncate">{skill.title}</p>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-cyan-400'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-extrabold shrink-0 ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger zone: delete account */}
      <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-300 text-sm">حذف الحساب</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              حذف حسابك هيمسح كل بياناتك نهائيًا (تقدمك، طلبات الصيدلية، التذكيرات، الإشعارات)
              وده إجراء مش قابل للتراجع.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-600/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف حسابي نهائيًا
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 dir-rtl">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                تأكيد حذف الحساب
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                  setDeleteError('');
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              الإجراء ده نهائي ومش هترجع فيه. هيتمسح حسابك وكل بياناتك المرتبطة بيه فورًا.
              اكتب <span className="text-red-300 font-bold">حذف</span> في الخانة تحت عشان تأكد.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="اكتب: حذف"
              className="w-full rounded-xl bg-slate-950 border border-red-500/30 text-slate-100 py-2.5 px-3 text-sm text-center focus:outline-none focus:border-red-500/60"
            />
            {deleteError && <p className="text-xs text-red-400 mt-2">{deleteError}</p>}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                  setDeleteError('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'حذف' || deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                حذف نهائيًا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
