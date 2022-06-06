/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BC1g7KiqzPqJ8Av78vZZpts7dy0t78XgXAlayRox6t59XSq21vWhZugnMMun-Opn5xmQlSsqeUh0iUb2vwPQQb4';

// const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/*
 !!! handled in pwabuilduer-sw-register.js

 if ('serviceWorker' in navigator && 'PushManager' in window) {
 console.log('Service Worker and Push is supported');

 navigator.serviceWorker.register('sw.js')
 .then(function(swReg) {
 console.log('Service Worker is registered', swReg);

 swRegistration = swReg;

 initializeUI();
 })
 .catch(function(error) {
 console.error('Service Worker Error', error);
 });
 } else {
 console.warn('Push messaging is not supported');
 pushButton.textContent = 'Push Not Supported';
 }*/

function initializeUI() {
    /*pushButton.addEventListener('click', function() {
     pushButton.disabled = true;
     if (isSubscribed) {
     unsubscribeUser();
     } else {
     subscribeUser();
     }
     });*/
    if(typeof swRegistration === 'undefined'){
        JL().fatal('swRegistration is undefined');
        console.error('swRegistration is undefined')
    }else{
        if(swRegistration.pushManager){
            console.debug('OK')
        }else {
            console.error('No pushManager')
            alert('No pushManager')
        }
    }
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
                console.log('User IS subscribed.',JSON.stringify(subscription));
                $.post('/customer/notifysubscription', {sub: JSON.stringify(subscription)}, function (res) {
                    console.log('Subscription is OK')
                }, 'json')
            } else {
                console.error('User is NOT subscribed.');
                JL().fatal('User is NOT subscribed.');
                subscribeUser();
            }

            // updateBtn();
        });
}

/*function updateBtn() {
 if (Notification.permission === 'denied') {
 pushButton.textContent = 'Push Messaging Blocked.';
 pushButton.disabled = true;
 updateSubscriptionOnServer(null);
 return;
 }

 if (isSubscribed) {
 pushButton.textContent = 'Disable Push Messaging';
 } else {
 pushButton.textContent = 'Enable Push Messaging';
 }

 pushButton.disabled = false;
 }*/

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log('User is subscribed now.',JSON.stringify(subscription));
            JL().info('User is subscribed now.',JSON.stringify(subscription))
            // updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            // updateBtn();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            JL().fatal(err)
            // updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function () {
            // updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            // updateBtn();
        });
}

/*function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}*/



