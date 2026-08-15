import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, Check } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { AppNotification } from '../types';

interface NotificationBellProps {
  userId: string | null | undefined;
  onOpenOrder?: () => void; // بيتنفذ لو المستخدم دوس على إشعار (نودّيه لصفحة الصيدلية مثلاً)
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `من ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `من ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `من ${days} يوم`;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ userId, onOpenOrder }) => {
  const { notifications, unreadCount, permission, requestPermission, markAsRead, markAllAsRead } =
    useNotifications(userId);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!userId) return null;

  const handleClickNotification = (n: AppNotification) => {
    if (!n.is_read) markAsRead(n.id);
    setOpen(false);
    if (n.order_id && onOpenOrder) onOpenOrder();
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
        title="الإشعارات"
      >
        {unreadCount > 0 ? <BellRing className="w-4 h-4 text-cyan-400" /> : <Bell className="w-4 h-4" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-950/50 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10">
            <span className="font-bold text-sm text-white">الإشعارات</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                علّم الكل كمقروء
              </button>
            )}
          </div>

          {permission !== 'granted' && (
            <button
              onClick={requestPermission}
              className="w-full text-right px-4 py-2.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 border-b border-amber-500/20 cursor-pointer hover:bg-amber-500/20"
            >
              🔔 فعّل إشعارات المتصفح عشان توصلك حتى وانت مش فاتح الموقع
            </button>
          )}

          <div className="max-h-80 overflow-y-auto min-h-[80px]">
            {/* سطر تشخيصي مؤقت — هيوضح العدد الحقيقي اللي الكود شايفه، وهنشيله بعد ما نتأكد المشكلة اتحلت */}
            <p className="px-4 py-1.5 text-[10px] text-amber-400 bg-amber-500/5 border-b border-amber-500/10">
              🔧 تشخيص: عدد الإشعارات المحمّلة = {notifications.length} | غير مقروء = {unreadCount}
            </p>
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8">مفيش إشعارات لسه</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-right px-4 py-3 border-b border-purple-500/5 transition-colors cursor-pointer ${
                    n.is_read ? 'bg-transparent' : 'bg-purple-500/10'
                  } hover:bg-purple-500/15`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{n.title || '(بدون عنوان)'}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{n.body || '(بدون نص)'}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
