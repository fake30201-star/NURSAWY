import { Megaphone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Announcement {
  id: string;
  title: string;
  message: string;
}

const DISMISSED_KEY = 'nursawy_dismissed_announcements';

export const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('announcements')
        .select('id, title, message')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        let dismissed: string[] = [];
        try {
          dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
        } catch {
          dismissed = [];
        }
        setAnnouncements(data.filter((a) => !dismissed.includes(a.id)));
      }
    })();
  }, []);

  const dismiss = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      const dismissed: string[] = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
      dismissed.push(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    } catch {
      // ignore
    }
  };

  if (announcements.length === 0) return null;

  return (
    <div className="dir-rtl relative z-40 space-y-2 px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
      {announcements.map((a) => (
        <div
          key={a.id}
          className="flex items-start gap-3 bg-gradient-to-l from-purple-950/80 to-indigo-950/80 border border-purple-500/40 rounded-2xl px-4 py-3 shadow-lg shadow-purple-950/30"
        >
          <Megaphone className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{a.title}</p>
            <p className="text-xs text-slate-300 mt-0.5">{a.message}</p>
          </div>
          <button
            onClick={() => dismiss(a.id)}
            className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
