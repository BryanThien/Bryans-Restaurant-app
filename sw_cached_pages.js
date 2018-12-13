const cacheName = 'v1';

const cacheAssets = [
'/',
'/index.html',
'/restaurant.html',
'/css/styles.css',
'/js/restaurant_info.js',
'/js/main.js',
'/js/dbhelper.js',
'/data/restaurants.json',
'/img/1.jpg',
'/img/2.jpg',
'/img/3.jpg',
'/img/4.jpg',
'/img/5.jpg',
'/img/6.jpg',
'/img/7.jpg',
'/img/8.jpg',
'/img/9.jpg',
'/img/10.jpg',
]

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service Worker: Caching Files");
                return cache.addAll(cacheAssets);
            })
    );
});

self.addEventListener('activate', e => {
    console.log("service worker: activated");
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log("Service Worker: clearing old cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                console.log("found", e.request, ' in cache');
                return response;
            }
            else {
                console.log("Could not find ", e.request, " in cache, fetching!");
                return fetch(e.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(e.request, clonedResponse);
                    }) 
                    return response;                   
                })
                .catch(err => {
                    console.error(err);
                });
            }
        })
    );
});
