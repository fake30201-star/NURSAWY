// Service Worker بسيط لـ Nursawy PWA.
// بيخزن الصفحة الأساسية والملفات الثابتة عشان الموقع يفتح بسرعة ويشتغل ولو النت ضعيف.
// ملحوظة: ميتدخلش في طلبات الذكاء الاصطناعي (Puter.js) أو Supabase — دول محتاجين نت شغال دايمًا.

const CACHE_NAME = 'nursawy-cache-v1';
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

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      // لو عندنا نسخة مخزنة، نديها فورًا (سريع)، وفي الخلفية نحدثها من النت
      return cached || networkFetch;
    })
  );
});
