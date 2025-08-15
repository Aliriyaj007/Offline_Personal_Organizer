const CACHE_NAME = 'offline-organizer-cache-v1.1'; // Increment version for updates
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Note: esm.sh URLs are versioned, so they are effectively immutable and good for caching.
  // If you had local JS/CSS bundles, you'd list them here.
  // The service worker will also cache network requests made by the app dynamically.
  // Add main app shell files. With ESM modules loaded via importmap,
  // the browser handles fetching them. The service worker can cache these network requests.
  // We'll rely on dynamic caching for JS modules and Recharts for simplicity here.
  // If you had specific bundled assets (e.g. /app.js, /styles.css), list them.
  '/logo.svg', // Add the main logo
  '/icons/icon-192x192.png', // Placeholder, actual PNG needed
  '/icons/icon-512x512.png'  // Placeholder, actual PNG needed
];

// Install event: Open cache and add core assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ServiceWorker: Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('ServiceWorker: Failed to cache app shell:', error);
      })
  );
});

// Activate event: Clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('ServiceWorker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new SW takes control immediately
});

// Fetch event: Serve cached assets if available, otherwise fetch from network.
// Strategy: Cache first for assets in ASSETS_TO_CACHE, Network first for others.
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // For navigation requests (HTML pages), try network first, then cache.
  // This ensures users get the latest HTML if online, but can still load if offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, cache the new response for future offline use
          if (response.ok) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html'); // Fallback to index.html
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images, etc.), use cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache
        }
        // Not in cache, fetch from network
        return fetch(event.request).then(networkResponse => {
          // Cache the new resource for future use
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
             // Cache only GET requests and valid responses
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        }).catch(error => {
          console.warn('ServiceWorker: Fetch failed for', event.request.url, error);
          // You could return a fallback asset here if appropriate for certain types
        });
      })
  );
});

// Optional: Skip waiting to activate the new service worker immediately.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
