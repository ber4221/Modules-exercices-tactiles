const CACHE_NAME = 'exercices-tactiles-v4';
const PRECACHE = [
  "./LISEZ-MOI.txt",
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
  "./exercises.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
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
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    ).then(() => self.clients.claim())
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
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(r => r || caches.match('./index.html'))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
