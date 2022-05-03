
// Detects if device is on iOS
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
    showInstallPromotion(true);
    this.setState({ showInstallMessage: true });
}

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {




  // if (navigator.serviceWorker.controller) {
  //   console.log("[PWA Builder] active service worker found, no need to register");
  // } else {
    // Register the service worker
    navigator.serviceWorker
      .register("/pwabuilder-sw.js", {
        scope: "/"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
        // pushnotify.js
        // push notification settings
        swRegistration = reg;
          var serviceWorker;
          if (reg.installing) {
              serviceWorker = reg.installing;
              // console.log('Service worker installing');
          } else if (reg.waiting) {
              serviceWorker = reg.waiting;
              // console.log('Service worker installed & waiting');
          } else if (reg.active) {
              serviceWorker = reg.active;
              // console.log('Service worker active');
          }

          if (serviceWorker) {
              console.log("sw current state", serviceWorker.state);
              if (serviceWorker.state === "activated") {
                  //If push subscription wasnt done yet have to do here
                  JL().info("sw already activated");
                  initializeUI();
              }
              serviceWorker.addEventListener("statechange", function(e) {
                  console.log("sw statechange : ", e.target.state);
                  if (e.target.state === "activated") {
                      // use pushManger for subscribing here.
                      JL().info("Just now activated. now we can subscribe for push notification")
                      initializeUI();
                  }
              });
          }


      });
  // }
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    var installpwabtn = document.getElementById("installpwabtn");
    installpwabtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        $("#installpwapan").hide();
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
    });
    var cancelinstallpwabtn = document.getElementById("cancelinstallpwabtn")
    cancelinstallpwabtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        $("#installpwapan").hide();
    });
    var dontremindlater = document.getElementById("dontremindlater")
    dontremindlater.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        localStorage.setItem('dontremindlater','1');
        $("#installpwapan").hide();
    });
    if(!localStorage.getItem('dontremindlater'))
        showInstallPromotion();
});

window.addEventListener('appinstalled', (evt) => {
    localStorage.removeItem('dontremindlater');
    console.log('Smart home is installed');
    //TODO send message to server
});

function showInstallPromotion(iOS) {
    if(iOS){
        $('#installpwabtn').hide();
    }
    $('#installpwapan').show('fast', function (){
        if(iOS){
            $('#iosaddtohome').slideDown();
        }
    });

}