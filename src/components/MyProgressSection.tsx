import { Award, Calendar, CheckCircle2, Loader2, Sparkles, Star, TrendingUp, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { OSCE_SKILLS } from '../data/clinicalData';

export const MyProgressSection: React.FC = () => {
  const { user, fullName, email, isSubscribed } = useAuth();
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};
