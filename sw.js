const CACHE_NAME = 'grocery-expense-tracker-v8';

const STATIC_ASSETS = [
  '/Grocery.tracker/',
  '/Grocery.tracker/index.html',
  '/Grocery.tracker/manifest.json',
  '/Grocery.tracker/icon-192.png',
  '/Grocery.tracker/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js'
];

// URLs that should always be fetched fresh (APIs)
const NETWORK_FIRST = [
  'nominatim.openstreetmap.org',
  'world.openfoodfacts.org'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Network-first for live APIs (tax lookup, barcode lookup, location)
  const isNetworkFirst = NETWORK_FIRST.some(domain => url.includes(domain));
  if (isNetworkFirst) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (app shell, React, icons)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid GET responses
        if (
          event.request.method === 'GET' &&
          response &&
          response.status === 200 &&
          response.type !== 'opaque'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — return app shell
        if (event.request.mode === 'navigate') {
          return caches.match('/Grocery.tracker/index.html');
        }
      });
    })
  );
});
