import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AppNotification } from '../types';

// هوك مركزي للإشعارات: بيجيب الإشعارات المحفوظة، ويشترك في التحديث اللحظي (Realtime)
// عشان أي إشعار جديد (طلب جديد / تسعير / موافقة / رسالة شات / تسليم...) يوصل فورًا،
// وكمان بيحاول يعرض إشعار متصفح (Browser Notification) لو المستخدم موافق على الإذن.
export function useNotifications(userId: string | null | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch {
      // المتصفح مش بيدعم الإشعارات أو المستخدم رفض — مفيش داعي نعطل الموقع
    }
  };

  const showBrowserNotification = (title: string, body: string) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try {
      // لو فيه service worker شغال، استخدمه عشان الإشعار يبان حتى لو التاب في الخلفية
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification(title, { body, icon: '/icon.svg', badge: '/icon.svg' });
          } else {
            new Notification(title, { body, icon: '/icon.svg' });
          }
        });
      } else {
        new Notification(title, { body, icon: '/icon.svg' });
      }
    } catch {
      // تجاهل أي خطأ في عرض الإشعار عشان ميكسرش باقي الموقع
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
  };

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    let active = true;

    (async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (active && data) setNotifications(data as AppNotification[]);
    })();

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
        (payload) => {
          const notif = payload.new as AppNotification;
          setNotifications((prev) => [notif, ...prev]);
          showBrowserNotification(notif.title, notif.body);
          // صوت تنبيه بسيط (اختياري — بيتجاهل لو المتصفح رفض التشغيل التلقائي)
          audioRef.current?.play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, unreadCount, permission, requestPermission, markAsRead, markAllAsRead };
}
