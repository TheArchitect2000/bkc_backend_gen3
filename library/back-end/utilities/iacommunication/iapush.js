const webpush = require('web-push');

const publicVapidKey = "BC1g7KiqzPqJ8Av78vZZpts7dy0t78XgXAlayRox6t59XSq21vWhZugnMMun-Opn5xmQlSsqeUh0iUb2vwPQQb4";
const privateVapidKey = "JxYnKKd-4L49Qd8z2fbNakVBdgDD4l1KWe2qLXeZO-k";

//TODO Replace with panel.blocklychain.io email
webpush.setVapidDetails('mailto:mehdi@internetanywhere.io', publicVapidKey, privateVapidKey);


exports.pushNotification = (pushOptions)=> {
    console.debug('iapush.pushNotification:');
    console.debug(pushOptions.Subscription);
    webpush.sendNotification(JSON.parse(pushOptions.Subscription), pushOptions.message).catch(error => {
        console.error(error.stack);
    });
}