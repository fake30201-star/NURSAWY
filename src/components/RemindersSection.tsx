import { AlertCircle, Bell, CheckCircle2, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface Reminder {
  id: string;
  title: string;
  note: string | null;
  remind_at: string;
  is_done: boolean;
}

export const RemindersSection: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReminders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reminders')
      .select('id, title, note, remind_at, is_done')
      .eq('user_id', user.id)
      .order('remind_at', { ascending: true });
    setReminders((data as Reminder[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !reminderDate || !reminderTime) return;
    setSaving(true);
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      title: title.trim(),
      note: note.trim() || null,
      remind_at: new Date(`${reminderDate}T${reminderTime}`).toISOString(),
    });
    if (error) {
      alert('حصل خطأ: ' + error.message);
    } else {
      setTitle('');
      setNote('');
      setReminderDate('');
      setReminderTime('');
      await loadReminders();
    }
    setSaving(false);
  };

  const toggleDone = async (id: string, current: boolean) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_done: !current } : r)));
    await supabase.from('reminders').update({ is_done: !current }).eq('id', id);
  };

  const deleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await supabase.from('reminders').delete().eq('id', id);
  };

  const now = new Date();
  const isOverdue = (dateStr: string, done: boolean) => !done && new Date(dateStr) < now;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('ar-EG', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="dir-rtl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shrink-0">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">جدول التذكيرات</h2>
          <p className="text-xs text-slate-400">مواعيد المناوبات، الأدوية، أو أي حاجة تحب تفتكرها</p>
        </div>
      </div>

      {/* Add reminder form */}
      <form
        onSubmit={handleAdd}
        className="bg-slate-900 border border-purple-500/20 rounded-2xl p-5 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">العنوان</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مناوبة صباحية"
              className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">التاريخ</label>
            <input
              type="date"
              dir="ltr"
              required
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">الوقت</label>
            <input
              type="time"
              dir="ltr"
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">ملاحظة (اختياري)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أي تفاصيل إضافية..."
            className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-pink-600 text-white font-bold text-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          إضافة تذكير
        </button>
      </form>

      {/* Reminders list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin ml-2" /> جارِ التحميل...
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">مفيش تذكيرات لسه، ضيف أول واحد من فوق.</div>
      ) : (
        <div className="space-y-2">
          {reminders.map((r) => {
            const overdue = isOverdue(r.remind_at, r.is_done);
            return (
              <div
                key={r.id}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                  r.is_done
                    ? 'bg-slate-900/50 border-slate-800 opacity-60'
                    : overdue
                    ? 'bg-red-950/30 border-red-500/30'
                    : 'bg-slate-900 border-purple-500/20'
                }`}
              >
                <button
                  onClick={() => toggleDone(r.id, r.is_done)}
                  className="mt-0.5 shrink-0 cursor-pointer"
                  title={r.is_done ? 'إلغاء الإنجاز' : 'تعليم كمنجز'}
                >
                  <CheckCircle2 className={`w-5 h-5 ${r.is_done ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${r.is_done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {r.title}
                  </p>
                  {r.note && <p className="text-xs text-slate-400 mt-0.5">{r.note}</p>}
                  <p className={`text-xs flex items-center gap-1 mt-1.5 ${overdue ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                    {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {formatDate(r.remind_at)}
                    {overdue && ' (فات معاده)'}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
