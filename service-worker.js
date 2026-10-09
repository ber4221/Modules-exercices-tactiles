const CACHE_NAME = 'exercices-tactiles-v9-organisee';
const PRECACHE = [
  "./LISEZ-MOI.txt",
  "./manifest.webmanifest",
  "./index.html",
  "./exercises.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./exercices/N21-1.html",
  "./exercices/N21-3.html",
  "./exercices/N21-4.html",
  "./exercices/N21-6.html",
  "./exercices/N21-evaluation.html",
  "./exercices/N22-1.html",
  "./exercices/N22-4.html",
  "./exercices/N22-5.html",
  "./exercices/N8-4.html",
  "./exercices/N8-evaluation.html",
  "./images/N21-1a.jpg",
  "./images/N21-1b.jpg",
  "./images/N21-3.jpg",
  "./images/N21-4.jpg",
  "./images/N21-6.jpg",
  "./images/N21-evaluation.jpg",
  "./images/N22-1.jpg",
  "./images/N22-4.jpg",
  "./images/N22-5.jpg",
  "./images/N8-4.jpg",
  "./images/N8-evaluation.jpg",
  "./exercices/N7-2.html",
  "./exercices/N7-3.html",
  "./exercices/N7-evaluation.html",
  "./exercices/N9-1.html",
  "./images/N7-2.jpg",
  "./images/N7-3a.jpg",
  "./images/N7-3b.jpg",
  "./images/N7-evaluation.jpg",
  "./images/N9-1.jpg",
  "./exercices/N9-4.html",
  "./exercices/N9-5.html",
  "./exercices/N11-1.html",
  "./exercices/N11-2.html",
  "./exercices/N11-3.html",
  "./exercices/N11-4.html",
  "./exercices/N11-evaluation.html",
  "./images/N9-4.jpg",
  "./images/N9-5.jpg",
  "./images/N11-1a.jpg",
  "./images/N11-1b.jpg",
  "./images/N11-2.jpg",
  "./images/N11-3.jpg",
  "./images/N11-4.jpg",
  "./images/N11-evaluation-A.jpg",
  "./images/N11-evaluation-B.jpg"
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(PRECACHE.map(async url => {
      try {
        const response = await fetch(url, {cache:'no-cache'});
        if (response.ok) await cache.put(url, response.clone());
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.webmanifest')
  ) {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request, {cache:'no-cache'});
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(event.request)) ||
          (event.request.mode === 'navigate' ? await caches.match('./index.html') : Response.error());
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, response.clone());
    }
    return response;
  })());
});
