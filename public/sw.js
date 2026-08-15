// Service Worker بسيط لـ Nursawy PWA.
// بيخزن الصفحة الأساسية والملفات الثابتة عشان الموقع يفتح بسرعة لو النت ضعيف أو مقطوع.
// ملحوظة: ميتدخلش في طلبات الذكاء الاصطناعي (Puter.js) أو Supabase — دول محتاجين نت شغال دايمًا.

// مهم: كل مرة يتغيّر فيها هذا الملف نفسه (أو محتوى مهم في الموقع)، لازم نغيّر رقم
// النسخة ده يدويًا — ده بيجبر كل أجهزة المستخدمين تمسح الكاش القديم وتاخد كل حاجة
// جديدة فورًا بدل ما تفضل عالقة على نسخة قديمة.
const CACHE_NAME = 'nursawy-cache-v2';
const PRECACHE_URLS = ['/', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ميلمسش طلبات خارجية (Supabase، Puter.js، خطوط جوجل...) — نسيبها تروح للنت مباشرة دايمًا
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  // "النت الأول": نجرب نجيب أحدث نسخة من السيرفر أولًا. لو النت اشتغل، نستخدمها
  // ونحدث بيها الكاش فورًا (عشان أي تحديث في الكود يبان لأول تحميل مباشرة، مش
  // بعد زيارة كمان). لو النت مقطوع أو الطلب فشل، وقتها بس نرجع للنسخة المخزنة
  // كحل احتياطي أخير.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// لما المستخدم يدوس على إشعار، نفتحله تاب الموقع (أو نرجّعله للتاب المفتوح أصلاً)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
