function notifyMe() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
        // This is not how you would really do things if they aren't supported. :)
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        // var notification = new Notification("Hi there!");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                // var notification = new Notification("Hi there!");
            }
        });
    }

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
}


var lastnotifytime = 0;
function IA_Notify(title, text) {
    if(document.hasFocus()) return;
    //prevent very notifies
    var nw = Date.now();
    if(nw > lastnotifytime+10000){
        lastnotifytime = nw;
    } else {
        console.log('prevent blow-by-blow notification', text);
        return;
    }
    // var title = 'Title '+Date.now();
    var img = '/share/images/iasign_white.png';
    // var text = 'HEY! Your task "' + title + '" is now overdue.';
    var notification = new Notification(title, { body: text, icon: img });
    setTimeout(notification.close.bind(notification), 4000);
}

// setInterval(notify, 4000);


var IA_Notifies = {
    Messages: [],
    _addMessage: function(message){
        this.Messages.push(message);
        this._commit();
        ssbindRenderLevel('notifies');
    },
    _commit: function(){
        window.localStorage.setItem('ianotifies', JSON.stringify(IA_Notifies))
    },
    _clear: function () {
        swal.fire({title:"Attention", html: "Do you want to clear all notifications?", icon:"",
            imageUrl: "images/error.png",
            imageWidth: 50,
            showCancelButton: true,
            confirmButtonText: 'Clear'
        }).then((result) => {
            if (result.value) {
                this.Messages = [];
                this._commit();
                ssbindRenderLevel('notifies');
            }
        });
    }
};

notifyMe();

if (window.localStorage.getItem('ianotifies'))
    IA_Notifies.Messages = JSON.parse(window.localStorage.getItem('ianotifies')).Messages;
/*
var serviceWorker = new Worker('/pwabuilder-sw.js');
//console.log(serviceWorker)
serviceWorker.onmessage = function (e) {
    console.log('Message received from worker', e.data);
}

serviceWorker.postMessage = function (e) {
    console.log('Message received from post message');
    // console.log('Message received from post message', e.data);
}*/
navigator.serviceWorker.addEventListener('message', function(event) {
    // alert(event.data); // Hello World !
    // window.focus();
    //if(document.hasFocus())
        swal.fire("Notification", event.data, "info");
    //else
      //  IA_Notify('Notification', event.data);
    IA_Notifies._addMessage({
        mes: event.data,
        time: Date.now()
    });

    // ssbindRenderLevel('notifies');
});



ssbindRenderLevel('notifies');

$('#clearNotifications').click(function () {
    IA_Notifies._clear();
});

$('#activateNotifications').click(function () {
    // unsubscribeUser();
    initializeUI();
});

self.addEventListener('notificationclick', function(e) {
    console.log('noooooo')
    console.log(self.location.origin)
    e.waitUntil(
        // clients.openWindow('https://iabroker.internetanywhere.io')
        clients.openWindow(self.location.origin)
    );
    /*if (!e.action) {
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
    });*/
});