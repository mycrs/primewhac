// v5 - Service Worker tamamen devre dışı: tüm cache'leri sil, kendini yok et
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Tüm cache'leri sil
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Tüm açık sekmeleri yenile
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then((clients) => {
            clients.forEach((c) => {
              try { c.navigate(c.url); } catch(e) {}
            });
          });
      })
      .then(() => {
        // Kendini kaldır - bir daha çalışmasın
        return self.registration.unregister();
      })
  );
});

// Fetch: tüm istekleri ağa gönder, hiçbir şeyi cache'e alma
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
