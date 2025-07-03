const CACHE_NAME = 'go-green-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // Path ke ikon Anda (langsung di root, tanpa garis miring)
    'icon-192x192.png',
    'icon-512x512.png',
    // Font Awesome (jika Anda ingin meng-cache-nya untuk offline)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Event: Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache dibuka');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Gagal menyimpan cache selama instalasi:', error);
            })
    );
});

// Event: Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Event: Fetch (untuk melayani aset dari cache atau jaringan)
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/index.html'); // Tetap pakai / untuk index.html sebagai fallback
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(fetchResponse => {
                        return caches.open(CACHE_NAME).then(cache => {
                            if (fetchResponse.status === 200) {
                                cache.put(event.request.url, fetchResponse.clone());
                            }
                            return fetchResponse;
                        });
                    })
                    .catch(error => {
                        console.error('Service Worker: Gagal mengambil aset:', error);
                    });
            })
    );
});
