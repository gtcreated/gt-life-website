// This is a basic Service Worker to pass the PWA install requirements
self.addEventListener('install', (event) => {
    console.log('GT Life App Installed!');
});

self.addEventListener('fetch', (event) => {
    // This allows the app to fetch things from the internet normally
    event.respondWith(fetch(event.request));
});