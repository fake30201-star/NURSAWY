import { Crown, FileText, Loader2, Mail, MailOpen, Megaphone, Plus, RotateCcw, Shield, ShieldOff, Star, StarOff, Trash2, Users } from 'lucide-react';
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

interface AnnouncementRow {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

interface ContactMessageRow {
  id: string;
  name: string | null;
  email: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New announcement form
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: contentRows }, { data: announcementRows }, { data: messageRows }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, is_admin, is_subscribed, created_at').order('created_at', { ascending: false }),
      supabase.from('site_content').select('key, value, updated_at').order('updated_at', { ascending: false }),
      supabase.from('announcements').select('id, title, message, is_active, created_at').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('id, name, email, subject, message, is_read, created_at').order('created_at', { ascending: false }),
    ]);
    setUsers((profiles as ProfileRow[]) || []);
    setContent((contentRows as ContentRow[]) || []);
    setAnnouncements((announcementRows as AnnouncementRow[]) || []);
    setMessages((messageRows as ContactMessageRow[]) || []);
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

  const postAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    setPostingAnnouncement(true);
    const { data, error } = await supabase
      .from('announcements')
      .insert({ title: newTitle.trim(), message: newMessage.trim(), is_active: true })
      .select()
      .single();
    if (error) {
      alert('حصل خطأ: ' + error.message);
    } else if (data) {
      setAnnouncements((prev) => [data as AnnouncementRow, ...prev]);
      setNewTitle('');
      setNewMessage('');
    }
    setPostingAnnouncement(false);
  };

  const toggleAnnouncementActive = async (id: string, current: boolean) => {
    setBusyId(id + 'ann');
    const { error } = await supabase.from('announcements').update({ is_active: !current }).eq('id', id);
    if (!error) {
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !current } : a)));
    }
    setBusyId(null);
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('متأكد إنك عايز تحذف التنبيه ده؟')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const markMessageRead = async (id: string, current: boolean) => {
    setBusyId(id + 'msg');
    const { error } = await supabase.from('contact_messages').update({ is_read: !current }).eq('id', id);
    if (!error) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: !current } : m)));
    }
    setBusyId(null);
  };

  const totalUsers = users.length;
  const totalSubscribed = users.filter((u) => u.is_subscribed).length;
  const totalAdmins = users.filter((u) => u.is_admin).length;
  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

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
          <p className="text-xs text-slate-400">إدارة المستخدمين والاشتراكات والتنبيهات ورسائل التواصل</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-3">
          <Mail className="w-8 h-8 text-pink-400" />
          <div>
            <p className="text-2xl font-extrabold text-white">{unreadMessagesCount}</p>
            <p className="text-xs text-slate-400">رسائل غير مقروءة</p>
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

      {/* Announcements */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/10 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-sm">تنبيهات لكل الزوار</h3>
        </div>

        <form onSubmit={postAnnouncement} className="p-4 space-y-3 border-b border-purple-500/10">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="عنوان التنبيه"
            className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
          />
          <textarea
            required
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="نص التنبيه..."
            className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60 resize-none"
          />
          <button
            type="submit"
            disabled={postingAnnouncement}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {postingAnnouncement ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            نشر التنبيه
          </button>
        </form>

        <div className="divide-y divide-purple-500/5">
          {announcements.length === 0 && (
            <p className="p-6 text-center text-slate-500 text-sm">مفيش تنبيهات لسه.</p>
          )}
          {announcements.map((a) => (
            <div key={a.id} className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-200">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAnnouncementActive(a.id, a.is_active)}
                  disabled={busyId === a.id + 'ann'}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 ${
                    a.is_active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {a.is_active ? 'مفعّل' : 'متوقف'}
                </button>
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact messages */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/10 flex items-center gap-2">
          <Mail className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-white text-sm">رسائل التواصل الواردة</h3>
        </div>
        <div className="divide-y divide-purple-500/5">
          {messages.length === 0 && (
            <p className="p-6 text-center text-slate-500 text-sm">مفيش رسائل لسه.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`p-4 space-y-1.5 ${!m.is_read ? 'bg-pink-950/10' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-200">{m.subject}</p>
                  <p className="text-[11px] text-slate-500" dir="ltr">{m.name} · {m.email}</p>
                </div>
                <button
                  onClick={() => markMessageRead(m.id, m.is_read)}
                  disabled={busyId === m.id + 'msg'}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 ${
                    m.is_read
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  }`}
                >
                  {m.is_read ? <MailOpen className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                  {m.is_read ? 'مقروءة' : 'غير مقروءة'}
                </button>
              </div>
              <p className="text-xs text-slate-400">{m.message}</p>
            </div>
          ))}
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
