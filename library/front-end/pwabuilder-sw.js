// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

// self.importScripts("javascripts/ianotification.js");

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Cached offline page during install");

      if (offlineFallbackPage === "/offline.html") {
        return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
      }

      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function (error) {
      // The following validates that the request was for a navigation to a new document
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }

      // console.error("Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});

//Web Push Notification

self.addEventListener('push', function(e) {
    console.log('push received');
    clients.matchAll().then(function(c) {
        if (c.length === 0) {
            // Show notification
                //self.registration.showNotification('Push notification')
                console.log('[Service Worker] Push Received.');
                console.log(`[Service Worker] Push had this data: "${e.data.text()}"`);

                const title = 'BKC Smart Home';
                const options = {
                    body: e.data.text(),
                    icon:  '/resources/images/iasign_white.png',
                    badge: 'images/badge.png',
                    actions: [
                        {
                            action: 'show',
                            title: 'Open App',
                            icon: '/check.png'
                        },
                        {
                            action: 'ignore',
                            title: 'OK',
                            icon: '/delete.png'
                        }
                    ]
                };

                // e.waitUntil(
                    self.registration.showNotification(title, options)
                // );
            // IA_Notify(title, e.data.text());//////
        } else {
            // Send a message to the page to update the UI
            console.log('[Service Worker] Application is already open!');
            console.log('[Service Worker] new notification: ', e.data.text());
            c[0].postMessage(e.data.text());
        }

        //send pushed message to window
        // self.postMessage(e.data.text())
    });
});

self.addEventListener('notificationclick', function(e) {

    if (!e.action) {
        console.log('No button clicked');
        return;
    }
    switch (e.action) {
        case 'show':
            console.log('User wants to see more');
            e.waitUntil(
                // clients.openWindow('https://iabroker.internetanywhere.io')
                clients.openWindow(self.location.origin)
            );
            break;
        case 'ignore':
            console.log('User wants to ignore the notification');
            break;
        default:
            console.log(`The ${e.action} action is unknown`);
            break;
    }



    // close all notifications
    self.registration.getNotifications().then(function(notifications) {
        notifications.forEach(function(notification) {
            notification.close();
        });
    });
});

caches.keys().then(function(names) {
    for (let name of names)
        caches.delete(name);
});

/*self.addEventListener("activate", e => {
    //on activate
    //event.waitUntil(clients.claim());
    /!*clients.matchAll().then(function(c) {
        for(let i = 0 ; i< c.length ; i++){
            c[i].close();
        }
    })*!/
    e.waitUntil(
        // clients.openWindow('https://iabroker.internetanywhere.io')
        clients.openWindow('https://iabroker.internetanywhere.io')
    );
});*/

