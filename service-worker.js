const cacheName = 'cache-v2';
const files = [
  '/',
  'index.html',
  'css/style.css',
  'js/reversi.js',
  'js/ai.js',
  'js/ui.js',
  'fonts/roboto-regular.woff',
  'fonts/roboto-bold.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
      cache.addAll(files);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});