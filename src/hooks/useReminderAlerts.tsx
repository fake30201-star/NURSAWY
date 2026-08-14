import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// هوك بيراقب تذكيرات المستخدم في الخلفية (بغض النظر عن الصفحة اللي هو فاتحها)،
// ولما ميعاد أي تذكير يستحق، بيضيف له صف في جدول notifications.
// جرس الإشعارات (NotificationBell / useNotifications) بيكون مشترك في التحديث
// اللحظي على نفس الجدول، فهو اللي هيتكفل بعرض إشعار المتصفح وتحديث الجرس —
// كده منتجنبش تكرار الإشعار مرتين. بيفحص كل 20 ثانية، وكمان أول ما التطبيق يتفتح.
export function useReminderAlerts(userId: string | null | undefined) {
  const checkingRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const checkDueReminders = async () => {
      if (checkingRef.current) return;
      checkingRef.current = true;
      try {
        const { data } = await supabase
          .from('reminders')
          .select('id, title, note, remind_at')
          .eq('user_id', userId)
          .eq('is_done', false)
          .eq('notified', false)
          .lte('remind_at', new Date().toISOString());

        if (data && data.length > 0) {
          for (const reminder of data) {
            await supabase.from('notifications').insert({
              recipient_id: userId,
              order_id: null,
              title: `تذكير: ${reminder.title} ⏰`,
              body: reminder.note || 'حان معاد التذكير ده دلوقتي',
            });
            await supabase.from('reminders').update({ notified: true }).eq('id', reminder.id);
          }
        }
      } finally {
        checkingRef.current = false;
      }
    };

    checkDueReminders();
    const interval = setInterval(checkDueReminders, 20000);

    return () => clearInterval(interval);
  }, [userId]);
}
