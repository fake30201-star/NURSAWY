import { CheckCircle2, Loader2, Mail, MessageSquare, Send } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const ContactSection: React.FC = () => {
  const { user, fullName, email } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;

    setSending(true);
    setError(null);
    const { error: insertError } = await supabase.from('contact_messages').insert({
      user_id: user.id,
      name: fullName,
      email,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (insertError) {
      setError('حصل خطأ أثناء إرسال رسالتك، حاول تاني.');
    } else {
      setSent(true);
      setSubject('');
      setMessage('');
    }
    setSending(false);
  };

  return (
    <div className="dir-rtl max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">تواصل معنا</h2>
          <p className="text-xs text-slate-400">عندك مشكلة أو اقتراح؟ ابعتلنا وهيوصل مباشرة للأدمن</p>
        </div>
      </div>

      {sent ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-white font-bold">تم إرسال رسالتك بنجاح!</p>
          <p className="text-xs text-slate-400">هنراجعها في أقرب وقت.</p>
          <button
            onClick={() => setSent(false)}
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer underline"
          >
            إرسال رسالة تانية
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-purple-500/20 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 rounded-xl px-3 py-2">
            <Mail className="w-3.5 h-3.5" />
            <span dir="ltr">{email}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">الموضوع</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: مشكلة في تسجيل الدخول"
              className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">الرسالة</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك بالتفصيل..."
              className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold py-2.5 text-sm cursor-pointer disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'جارِ الإرسال...' : 'إرسال الرسالة'}
          </button>
        </form>
      )}
    </div>
  );
};
