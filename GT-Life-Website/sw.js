const CACHE_NAME = 'gt-life-cache-v1';

// Install the Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('GT Life App Installed!');
});

// Intercept network requests (satisfies Android Chrome's strict PWA rules)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});