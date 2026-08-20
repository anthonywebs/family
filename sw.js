/* Minimal service worker to make the app installable (PWA) with a network-first cache. */
const CACHE = 'family-app-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches
                    .open(CACHE)
                    .then(cache => cache.put(event.request, copy))
                    .catch(() => {});
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
