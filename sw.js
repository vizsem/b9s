var APPSHELL_CACHE = 'appshell-v2';
var DYNAMIC_CACHE = 'dynamic';
//service worker life cycle event related
self.addEventListener('install', function(event){
    console.log('[SW] Installing service worker...', event);
    event.waitUntil(
        caches.open(APPSHELL_CACHE)
        .then(function(cache){
            console.log('[SW] Pre-caching app shell..');
            //cache.add('/');
            //cache.add('/index.html');
            //cache.add('/src/js/app.js');
            cache.addAll([
                '/',
                '/index.html',
                '/offlinepage.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://code.getmdl.io/1.3.0/material.indigo-red.min.css'
            ]);
        })
    );
});
self.addEventListener('activate', function(event){
    console.log('[SW] activating service worker...', event);
    event.waitUntil(
        caches.keys()
        .then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if (key !== APPSHELL_CACHE && key !== DYNAMIC_CACHE){
                    return caches.delete(key);
                }
            }));
        })
    )
    return self.clients.claim();
});
self.addEventListener('fetch', function(event){
    //console.log('[SW] fetching...', event);
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }else{
                return fetch(event.request)
                .then(function(res){
                    return caches.open(DYNAMIC_CACHE)
                    .then(function(cache){
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                })
                .catch(function(err){
                    // kode baru yang ditambahkan disini
                    return caches.open(APPSHELL_CACHE)
                    .then(function(cache){
                        return cache.match('/offlinepage.html');
                    });
                });
            }
        })
    );
});