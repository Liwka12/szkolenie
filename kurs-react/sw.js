const CACHE_NAME = 'shoutbox-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './manifest.json'
];

// 1. Instalacja: Zapisujemy pliki na stałe do pamięci urządzenia
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('PWA: Zapisywanie plików w Cache...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Aktywacja: Czyszczenie starych wersji Cache (opcjonalnie)
self.addEventListener('activate', (event) => {
    console.log('PWA: Service Worker aktywny!');
});

// 3. Obsługa zapytań: Najpierw sprawdź Cache, potem sieć
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});