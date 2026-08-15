import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AppNotification } from '../types';

// بعض البيئات (زي المعاينة جوه إطار iframe مقيّد أو متصفحات بسياسات صارمة) بتمنع
// الوصول لـ Notification API خالص وبترمي خطأ (SecurityError) لمجرد ما تقرأ أي خاصية
// منها. الدالة دي بتتأكد إن الوصول آمن قبل ما نستخدمه في أي مكان، عشان الموقع
// (وأهم حاجة: جرس الإشعارات) ميتكسرش أبدًا حتى لو الإذن ده مش متاح خالص.
function safeGetNotificationPermission(): NotificationPermission {
  try {
    if (typeof Notification === 'undefined') return 'denied';
    return Notification.permission;
  } catch {
    return 'denied';
  }
}

// هوك مركزي للإشعارات: بيجيب الإشعارات المحفوظة، ويشترك في التحديث اللحظي (Realtime)
// عشان أي إشعار جديد (طلب جديد / تسعير / موافقة / رسالة شات / تسليم...) يوصل فورًا،
// وكمان بيحاول يعرض إشعار متصفح (Browser Notification) لو المستخدم موافق على الإذن.
export function useNotifications(userId: string | null | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(safeGetNotificationPermission());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const requestPermission = async () => {
    try {
      if (typeof Notification === 'undefined') return;
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch {
      // المتصفح مش بيدعم الإشعارات، أو رفض الإذن، أو البيئة مقيّدة (زي إطار iframe) — مفيش داعي نعطل الموقع
    }
  };

  const showBrowserNotification = (title: string, body: string) => {
    try {
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
      // لو فيه service worker شغال، استخدمه عشان الإشعار يبان حتى لو التاب في الخلفية
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification(title, { body, icon: '/icon.svg', badge: '/icon.svg' });
          } else {
            new Notification(title, { body, icon: '/icon.svg' });
          }
        }).catch(() => {});
      } else {
        new Notification(title, { body, icon: '/icon.svg' });
      }
    } catch {
      // تجاهل أي خطأ في عرض الإشعار عشان ميكسرش باقي الموقع (بما فيه جرس الإشعارات نفسه)
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

    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) {
        // بنسجل الخطأ في الـ Console عشان لو فيه مشكلة صلاحيات (RLS) أو اتصال تبان فورًا
        console.error('تعذر تحميل الإشعارات:', error.message);
        return;
      }
      if (active && data) setNotifications(data as AppNotification[]);
    };

    fetchLatest();

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
        (payload) => {
          const notif = payload.new as AppNotification;
          setNotifications((prev) => (prev.some((n) => n.id === notif.id) ? prev : [notif, ...prev]));
          showBrowserNotification(notif.title, notif.body);
          // صوت تنبيه بسيط (اختياري — بيتجاهل لو المتصفح رفض التشغيل التلقائي)
          audioRef.current?.play().catch(() => {});
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('تعذر الاشتراك في التحديث اللحظي للإشعارات، الحالة:', status);
        }
      });

    // فحص احتياطي (Polling) كل 25 ثانية: لو التحديث اللحظي (Realtime) اتعطل لأي
    // سبب (شبكة، بروكسي، إلخ)، المستخدم برضه هيشوف الإشعارات الجديدة خلال ثواني معدودة
    const pollInterval = setInterval(fetchLatest, 25000);

    return () => {
      active = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, unreadCount, permission, requestPermission, markAsRead, markAllAsRead };
}
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('تعذر الاشتراك في التحديث اللحظي للإشعارات، الحالة:', status);
        }
      });

    // فحص احتياطي (Polling) كل 25 ثانية: لو التحديث اللحظي (Realtime) اتعطل لأي
    // سبب (شبكة، بروكسي، إلخ)، المستخدم برضه هيشوف الإشعارات الجديدة خلال ثواني معدودة
    const pollInterval = setInterval(fetchLatest, 25000);

    return () => {
      active = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, unreadCount, permission, requestPermission, markAsRead, markAllAsRead };
}
