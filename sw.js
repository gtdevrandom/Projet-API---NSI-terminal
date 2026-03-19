const CACHE_NAME = 'kalifi-v1';
const ASSETS = [
  './',
  './index.html',
  './public/style.css',
  './src/script.js',
  './manifest.json',
  './public/images/logo/logo-192.webp',
  './public/images/logo-512.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request).catch(() => {
      return caches.match('./index.html');
    }))
  );
});