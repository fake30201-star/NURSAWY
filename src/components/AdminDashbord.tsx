import { Crown, FileText, Loader2, RotateCcw, Shield, ShieldOff, Star, StarOff, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  is_subscribed: boolean;
  created_at: string;
}

interface ContentRow {
  key: string;
  value: string;
  updated_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: contentRows }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, is_admin, is_subscribed, created_at').order('created_at', { ascending: false }),
      supabase.from('site_content').select('key, value, updated_at').order('updated_at', { ascending: false }),
    ]);
    setUsers((profiles as ProfileRow[]) || []);
    setContent((contentRows as ContentRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleField = async (userId: string, field: 'is_admin' | 'is_subscribed', current: boolean) => {
    setBusyId(userId + field);
    const { error } = await supabase.from('profiles').update({ [field]: !current }).eq('id', userId);
    if (error) {
      alert('حصل خطأ: ' + error.message);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, [field]: !current } : u)));
    }
    setBusyId(null);
  };

  const resetContent = async (key: string) => {
    if (!confirm(`متأكد إنك عايز ترجع "${key}" للنص الافتراضي؟`)) return;
    const { error } = await supabase.from('site_content').delete().eq('key', key);
    if (error) {
      alert('حصل خطأ: ' + error.message);
    } else {
      setContent((prev) => prev.filter((c) => c.key !== key));
    }
  };

  const totalUsers = users.length;
  const totalSubscribed = users.filter((u) => u.is_subscribed).length;
  const totalAdmins = users.filter((u) => u.is_admin).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin ml-2" /> جارِ تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="dir-rtl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">لوحة تحكم الأدمن</h2>
          <p className="text-xs text-slate-400">إدارة المستخدمين والاشتراكات والنصوص المعدّلة</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" />
          <div>
            <p className="text-2xl font-extrabold text-white">{totalUsers}</p>
            <p className="text-xs text-slate-400">إجمالي المستخدمين</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-400" />
          <div>
            <p className="text-2xl font-extrabold text-white">{totalSubscribed}</p>
            <p className="text-xs text-slate-400">مشتركين</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="text-2xl font-extrabold text-white">{totalAdmins}</p>
            <p className="text-xs text-slate-400">أدمن</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h3 className="font-bold text-white text-sm">كل المستخدمين</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-purple-500/10">
                <th className="text-right p-3 font-bold">الاسم</th>
                <th className="text-right p-3 font-bold">الإيميل</th>
                <th className="text-center p-3 font-bold">مشترك</th>
                <th className="text-center p-3 font-bold">أدمن</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-purple-500/5 last:border-0">
                  <td className="p-3 text-slate-200 font-bold">{u.full_name || '—'}</td>
                  <td className="p-3 text-slate-400" dir="ltr">{u.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleField(u.id, 'is_subscribed', u.is_subscribed)}
                      disabled={busyId === u.id + 'is_subscribed'}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all disabled:opacity-50 ${
                        u.is_subscribed
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {u.is_subscribed ? <Star className="w-3 h-3" /> : <StarOff className="w-3 h-3" />}
                      {u.is_subscribed ? 'مفعّل' : 'غير مفعّل'}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleField(u.id, 'is_admin', u.is_admin)}
                      disabled={busyId === u.id + 'is_admin'}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all disabled:opacity-50 ${
                        u.is_admin
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {u.is_admin ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                      {u.is_admin ? 'أدمن' : 'عادي'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">مفيش مستخدمين مسجلين لسه</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edited content */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/10 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-white text-sm">النصوص المعدّلة في الموقع</h3>
        </div>
        <div className="divide-y divide-purple-500/5">
          {content.length === 0 && (
            <p className="p-6 text-center text-slate-500 text-sm">مفيش نصوص اتعدلت لسه، كل حاجة على الوضع الافتراضي.</p>
          )}
          {content.map((c) => (
            <div key={c.key} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold text-cyan-300 mb-1">{c.key}</p>
                <p className="text-sm text-slate-300 truncate">{c.value}</p>
              </div>
              <button
                onClick={() => resetContent(c.key)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-bold cursor-pointer hover:bg-red-500/20"
                title="رجّع للنص الافتراضي"
              >
                <RotateCcw className="w-3 h-3" /> استرجاع
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
