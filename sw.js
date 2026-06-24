/* NurseVerse Service Worker
   غيّر رقم VERSION كل ما ترفع تحديث جديد
   مثلاً: v1 → v2 → v3 ...
*/
const VERSION = 'v3';
const CACHE = 'nurseverse-' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

/* تثبيت: نحفظ الملفات في الكاش */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* تفعيل: نمسح الكاش القديم */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* طلبات الشبكة: نجيب من النت أولاً، لو مفيش نرجع الكاش */
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
