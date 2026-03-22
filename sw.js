// ============================================================
//  DosisUCI — Service Worker
// ============================================================

const CACHE_NAME = 'dosisUCI-v3';

// Solo assets locales — las URLs externas (Google Fonts)
// NO van en addAll porque fallan con CORS y rompen el install.
// Se cachean automáticamente en el primer fetch.
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './dosis.js',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── Install ───────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] install error:', err))
  );
});

// ── Activate: eliminar caches viejos ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar requests que no sean GET
  if (req.method !== 'GET') return;

  // Google Fonts y otros recursos externos → Stale While Revalidate
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(cached => {
          const fresh = fetch(req).then(response => {
            if (response.ok) cache.put(req, response.clone());
            return response;
          }).catch(() => cached); // sin red → usar cache
          return cached || fresh;
        })
      )
    );
    return;
  }

  // Navegación (HTML) → Network First
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets locales → Cache First
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return response;
      });
    })
  );
});
