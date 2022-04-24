/*
/!**
 * IA mqtt client is a mqtt client for IA admin to IA broker
 *
 *!/
let username = "_IA_ADMIN_SJDSHEJS_EUhdfjh@wfhi*&";
let password = "uet74reuyY763Y3376^%7WYESFIA";
var IABrokerURL = 'localhost:3008';
var mqtt = require('mqtt')
    , host = IABrokerURL // or localhost
    , client = mqtt.connect({
    username: username,
    password: password,
    clientId: username + '---',
    clean: true,
//            resubscribe: true
});
// or , client = mqtt.connect({ port: 1883, host: host, keepalive: 10000});

// client.subscribe('presence');
// client.publish('presence', 'bin hier');
client.on('message', function (topic, message) {
    console.log(message.toString());
});
client.on('connect', function () {
    console.log('IA MQTT Client Connected');
    /!*client.subscribe('alice/presence', function (err) {
        if (!err) {
            client.publish('alice/topic1', 'Hello I am alice')
        }
    })
    client.publish('alice/topic1', 'form program')*!/
})
//client.end();

module.exports = client;*/
