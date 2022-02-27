const mosca = require('mosca');
const iabroker_version = '3.0';

const dbConfig = require('./config/mongo.config');
const brokerConfig = require('./config/which.config');
const IADevice = require('./models/iadevice.model');
const IADeviceController = require('./controllers/iadevice.controller');
const IAActivity = require('./models/iaactivity.model');
const IAHome = require('./models/iahome.model');

const ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: dbConfig.serverurl + '/iabroker',
    pubsubCollection: 'pubsubs',
    mongo: {}
};

// cron

const cron = require('node-cron');

/**
 * All the types of brokers we can use:
 On this section we will list all the pubsubsettings that you can use as mosca brokers (plus the options for each one).
 - MongoDB
 var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};
 Mongo options:

 url: the mongodb url (default: 'mongodb://localhost:27017/ascoltatori?auto_reconnect')
 pubsubCollection: where to store the messages on mongodb (default: pubsub)
 mongo: settings for the mongodb connection
 - Redis
 var pubsubsettings = {
  type: 'redis',
  redis: require('redis'),
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "localhost"
};
 Redis options:

 port, the optional port to connect to;
 host, the optional host to connect to;
 db, the database to connect to (defaults to 0);
 password, the optional password to use;
 sub_conn, the optional redis connection to use for the sub and psub commands;
 pub_conn, the optional redis connection to use for the pub command;
 redis, the redis module (it will automatically be required if not present).
 - Mosquitto (! this uses an existing mqtt broker called mosquitto as the parent broker)
 var pubsubsettings = {
  type: 'mqtt',
  json: false,
  mqtt: require('mqtt'),
  host: '127.0.0.1',
  port: 1883
};
 Mosquitto options:

 clientId, the id of the MQTT client (max 23 chars)
 keepalive, the keepalive timeout in seconds (see the MQTT spec), the default is 3000;
 port, the port to connect to;
 host, the host to connect to;
 mqtt, the mqtt module (it will automatically be required if not present).
 - AMQP (RabbitMQ)
 var pubsubsettings = {
  type: 'amqp',
  json: false,
  client: {
     host:'127.0.0.1',
     port: 5672,
     login: 'username',
     password: 'pass'
  },
  amqp: require('amqp'),
  exchange: 'ascolatore5672'
};
 Amqp options:

 client, which is passed through to the amqp.createConnection method;
 exchange, the exchange name;
 amqp, the amqp module (it will automatically be required if not present);
 - QlobberFSQ
 You can use any of the QlobberFSQ constructor options, for example:

 var pubsubsettings = {
  type: 'zmq',
  json: false,
  zmq: require("zmq"),
  port: "tcp://127.0.0.1:33333",
  controlPort: "tcp://127.0.0.1:33334",
  delay: 10
};
 - ZeroMQ
 port, the zmq port where messages will be published;
 controlPort, the zmq port where control messages will be exchanged;
 remotePorts, the remote control ports that will be connected to;
 zmq, the zmq module (it will automatically be required if not present);
 delay, a delay that is applied to the ready and closed events (the default is 5ms);
 - Nothing
 You could just use NO settings at all and store everything in memory and not in a pub/sub broker


 * @type {{port: number, backend: {type: string, url: string, pubsubCollection: string, mongo: {}}}}
 */


/*var SECURE_KEY = __dirname + '/secure/tls-key.pem';
var SECURE_CERT = __dirname + '/secure/tls-cert.pem';
var SECURE_KEY = __dirname + '/secure/private.key';
var SECURE_CERT = __dirname + '/secure/certificate.crt';
var SECURE_KEY = __dirname + '/secure/localhost-key.pem';
var SECURE_CERT = __dirname + '/secure/localhost.pem';*/

// console.log('SECURE_CERT',SECURE_CERT)
const settings = {
    port: 1883,
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: dbConfig.serverurl+'/iabroker',
        ttl: {
            subscriptions:3600000*100,//100H , the time (ms) after which subscriptions will expire. It defaults to 1 hour.
            // packets:3600000 * 24 * 30//30days, the time (ms) after which packets will expire. It defaults to 1 hour.
            packets:3600000 * 100//100H, the time (ms) after which packets will expire. It defaults to 1 hour.
        }
    },
    /*
     publishNewClient:false,
     publishClientDisconnect:false,
    http: {
        port: 3001,
        bundle: true,
        // static: './'
    },*/
    /*logger: {
     name: "secureExample",
     level: 40,
     },*/
    /*https:{
        port: 3008,
        //bundle: true,
        credentials: {
            keyPath: brokerConfig.SECURE_KEY,
            certPath: brokerConfig.SECURE_CERT
        }
    },

    secure : {
        port: 8883,
        keyPath: brokerConfig.SECURE_KEY20,
        certPath: brokerConfig.SECURE_CERT20,
    }*/
    //VVVV GOOOOD for multi certificate
    interfaces:[
        {type: "https", port: 3008, credentials:{keyPath: brokerConfig.SECURE_KEY,certPath: brokerConfig.SECURE_CERT}},
        {type: "mqtts", port: 8883, credentials:{keyPath: brokerConfig.SECURE_KEY20,certPath: brokerConfig.SECURE_CERT20}}
    ]
};
const server = new mosca.Server(settings);

//TODO very security needed
//TODO maybe need to change to cache on Redis or go to database to persistent
const current = {
    clients: {},
    cronservices: {},
    /**
     * addCronService
     * @param expression a cron expression
     * @param installedService
     * @param tz
     */
    addCronService: (expression, installedService, tz)=>{
        try{
            let task = cron.schedule(expression, (fireDate) => {
                console.debug('running a task at ' + fireDate);
                // IAServiceRunner.runService(installedService);
                IAServiceRunner.runService(installedService, null, null, null, "cron");
            }, {
                scheduled: true,
                timezone: tz
            });
            current.cronservices[installedService._id] = task;
            console.debug('add cron for installedService ' + installedService._id)
        } catch (e){
            console.error('eeee', e)
        }
    },
    removeCronService: (installedServiceId)=> {
        if(current.cronservices[installedServiceId]) {
            current.cronservices[installedServiceId].stop();
            delete current.cronservices[installedServiceId];
        }
    }
};
//TODO load from a file and save every 1Hours
const lastState = {

};

global.current = current;
global.lastState = lastState;


// Configuring the database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*// Connecting to the database
mongoose.connect(dbConfig.serverurl+'/iasystem', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("BKC MQTT Broker successfully connected to the database");
}).catch(err => {
    console.error('BKC MQTT Broker could not connect to the database. Exiting now...', err);
    //TODO send error messages for admin in mqtt messages to monitor
    //process.exit();
});*/


// Service Runner
const IAServiceRunner = require('./iaservice/IAService');

/**
 * events:
 * A few known events to listen for:
 clientConnected : when a client is connected; the client is passed as a parameter.
 clientDisconnecting : when a client is being disconnected; the client is passed as a parameter.
 clientDisconnected : when a client is disconnected; the client is passed as a parameter.
 published : when a new message is published; the packet and the client are passed as parameters.
 delivered : when a client has sent back a puback for a published message; the packet and the client are passed as parameters.
 subscribed : when a client is subscribed to a topic; the topic and the client are passed as parameters.
 unsubscribed : when a client is unsubscribed to a topic; the topic and the client are passed as parameters.
 */

/*
errors of client esp8266:
 #define MQTT_CONNECTION_TIMEOUT     -4
 #define MQTT_CONNECTION_LOST        -3
 #define MQTT_CONNECT_FAILED         -2
 #define MQTT_DISCONNECTED           -1
 #define MQTT_CONNECTED               0
 #define MQTT_CONNECT_BAD_PROTOCOL    1
 #define MQTT_CONNECT_BAD_CLIENT_ID   2
 #define MQTT_CONNECT_UNAVAILABLE     3
 #define MQTT_CONNECT_BAD_CREDENTIALS 4
 #define MQTT_CONNECT_UNAUTHORIZED    5
 */
server.on('clientConnected', function(client) {
    /*//add connected client to current.clients
    current.clients[client.username] = client;*/
    console.debug('client connected', client.username);
});

server.on('clientDisconnecting', function(client) {
    console.debug('client Disconnecting ', client.id);
});

server.on('clientDisconnected', function(client) {

    let now = Date.now();
    if(lastState[client.username] && lastState[client.username].ConnectionTime){
        if(now - lastState[client.username].ConnectionTime < 1000){
            console.debug('client is not disconnected truly and may is connected now', client.username);
            return;
        }
    }

    //remove client from current.clients

    //delete from current.clients
    delete current.clients[client.id];
    console.log('#######--client ',client.id, 'removed from current.clients',Object.keys(current.clients).length);


    if(!client.username) return;

    //set lastState
    //add to lastState
    if (!lastState[client.username]) {
        lastState[client.username] = {}
    }


    lastState[client.username].Connected = false;
    lastState[client.username].CloseTime= now;

    console.debug('client Disconnected', client.username);
    let message = {
        topic: client.username,
        payload: '{"DEVICE_STATUS":"DISCONNECTED"}',
        qos: 1, // 0, 1, or 2
        retain: false // just false is ok
    };

    server.publish(message, function() {
        console.debug('DISCONNECTED done!');
    });

    let activity = {
        "event": "disconnect",
        "username": client.username
    };
    if(client && client.isDevice) {
        activity.DeviceId = IADevice.decryptid(client.id);
        activity.isDevice = true;
    }

    //add activity
    activity.__receivetime = Date.now();
    IAActivity.create(activity).then(addedactivity => {
        //ok
    }).catch(err => {
        console.error(err)
    });
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.debug('--------------------new publish');
    console.debug('client : ', client ? client.id : 'unknown client');
    let deviceOrUser = packet.topic;
    console.debug('topic : ', deviceOrUser);
    console.debug('payload : ', packet.payload.toString());

    if(deviceOrUser.startsWith('$')) return;

    //calling services joined to this devices
    IAServiceRunner.onPublish(server, deviceOrUser, packet.payload.toString());

    // add to ia activity

    let activity = {};
    try {
        activity = JSON.parse(packet.payload);
        if(client && (client.isDevice || activity.command)) {
            activity.DeviceId = IADevice.decryptid(deviceOrUser);
            activity.isDevice = true;

            if (!lastState[deviceOrUser]) {
                lastState[deviceOrUser] = {}
            }

            Object.assign(lastState[deviceOrUser] , activity);
            // console.log('laststate 2',lastState[packet.topic]);
        }
        activity.DeviceEncId = deviceOrUser;

    } catch (e){
        console.error(e);
        activity = {
            payload : packet.payload,
            topic: deviceOrUser
        }
    }
    if(client && client.homeId){
        activity.HomeId = client.homeId;
    }

    //add activity
    if(!activity.__receivetime)
        activity.__receivetime = Date.now();
    IAActivity.create(activity).then(addedactivity => {
            //ok
        }).catch(err => {
        console.error(err)
    });
});

server.on('subscribed', async function(topic, client) {
    if(client.needpassword){
        await IADevice.findOne({"MAC": base64decode(topic), Removed: false})
            .then(dev => {
                if(dev)
                    dev.SendPasswordToDevice();
            }).catch(err => {
                console.error('gethomeofdevice',err);
            });
    } else if(client.hastoken){
        console.log('has token ok');
        await IADevice.findOne({"MAC": base64decode(topic), Removed: false})
            .then(async (dev) => {
                if(dev)
                    dev.SendPasswordToDevice();
                else {
                    let values = client.id.split('.');
                    let token = values[0];
                    let homeid = base64decode(token);//todo change to real token
                    let name = values[1];
                    name = base64decode(name);
                    let type = values[2];
                    let series = values[3];
                    let mac = base64decode(topic);

                    await IADeviceController.createDevice(homeid, name, type, mac, null, series);
                }
            }).catch(err => {
                console.error('gethomeofdevice',err);
            });
    }
});

server.on('delivered', function(packet, client) {
    console.debug('--------------------delivered');
    console.debug('client : ', client ? client.id : 'unknown client');
    console.debug('topic : ', packet.topic);
    if(packet.payload)
        console.debug('payload : ', packet.payload.toString());
    /*if(packet.payload == 'close'){
     server.close();
     }*/

});

server.on('ready', setup);

const isAuthorized = async function (pubsub, client, topic) {
    if(client.OKConnection) {
        //if client is admin it could subscribe or publish to all devices , todo check security again
        if(client.isAdmin){
            return true;
        }
        //if client is home panel (it has client.homeId) it could subscribe or publish to device(topic) if device is for this home
        if(client.homeId){
            //todo need cache to speed up
            //todo need homeId in client was a jwt
            //check homeId is equal to device topic homeid
            //getDevice

            let deviceId = IADevice.decryptid(topic);
            return await IADevice.findById(deviceId)
                .then(dev => {
                    if (!dev) {
                        return false;
                    }
                    return dev.HomeId === client.homeId;
                }).catch(err => {
                    console.error('gethomeofdevice',err);
                    return false;
                });
        }
        //if client is a device it could not connect to topic of other devices
        if(client.id !== topic){
            console.debug('Closing','client 1');
            client.close();
            return false;
        }else{
            return true;
        }
    }
    //if client is a device in needpassword situation it could just subscribe
    if(client.needpassword) {
        if(client.id !== topic){
            console.debug('Closing','client 2', client.id, topic);
            client.close();
            return false;
        }else{
            return pubsub === 'sub';
        }
    }
    return false;
};

/**
 * for connecting clients to broker
 * @param client
 * @param username
 * @param password
 * @returns {Promise<*|string|null>}
 */
const getPasswordofUser = async function (client, username, password) {
    //TODO check client.id and username
    if(!username) return null;
    if(username.endsWith('admin'))return username+"IA";//FIXME not secure
    if(username.endsWith('adminhome')){
        let homeid = base64decode(password,'base64');
        return await IAHome.findById(homeid)
            .then(iahome => {
                if (!iahome) {
                    return null;
                }
                return password;
            }).catch(err => {
                console.error('getpassofuser',err);
                return null;
            });
        // _id.toString().substr(16)
    }

    //no need if(username === ('_IA_ADMIN_SJDSHEJS_EUhdfjh@wfhi*&'))return "uet74reuyY763Y3376^%7WYESFIA";

    // check database

    return await IADevice.findOne({_id: IADevice.decryptid(username), Removed: false})
        .then(iadevice => {
            if (!iadevice) {
                return null;
            }
            client.isDevice = true;
            return iadevice.Password;
        }).catch(err => {
            console.error('getpassofuser',err);
            client.close();//close to don't force device reset itself
            return undefined;
        });
};

const login = async function (client, username, password) {
    return password === await getPasswordofUser(client, username, password);
};

// Accepts the connection if the username and password are valid
const authenticate = async function(client, username, password, callback) {

    /*//prevent multi connect for one client
    if(current.clients[username])
        callback(null, false);*/


    console.debug('authenticateing ...', username);
    let activity = {
        "event": "connect",
        "username": username
    };

    let _password = password ? password.toString() : '';
    let authorized = false;
    if( _password === 'I_HAVE_NO_PASSWORD'){
        client.needpassword = true;
        client.OKConnection = false;
        client.isDevice = true;
        authorized = true;
        console.debug('authenticate', username, 'need password');
        activity.isDevice = true;
        activity.needpassword = true;
    } else if( _password === 'I_HAVE_TOKEN'){
        client.hastoken = true;
        client.OKConnection = false;
        client.isDevice = true;
        authorized = true;
        console.debug('authenticate', username, 'with token');
        activity.isDevice = true;
        activity.hastoken = true;
    } else {
        authorized = await login(client, username, _password);
        if (authorized) {

            client.username = username;
            client.OKConnection = true;

            /*no need if (username.endsWith('admin') || (username === ('_IA_ADMIN_SJDSHEJS_EUhdfjh@wfhi*&'))) {
                // client.isAdmin = true;
            }*/

            if (username.endsWith('adminhome')){
                client.homeId = base64decode(password.toString());
                activity.HomeId = client.homeId;
            }

            activity.authorized = true;
            activity.isDevice = client.isDevice;
            if(activity.isDevice){
                activity.DeviceId = IADevice.decryptid(username);
            }

            console.debug('authenticate', username, 'connected');
        } else {
            activity.authorized = false;
            //for more security:
            delete client.OKConnection;
            delete client.username;
            delete client.isAdmin;
            delete client.homeId;
            delete client.isDevice;
        }
    }


    //add connected client to current.clients
    current.clients[username] = client;
    console.log('#######++client ',username, 'added to current.clients',Object.keys(current.clients).length);
    //add to lastState
    if (!lastState[username]) {
        lastState[username] = {}
    }
    lastState[username].Connected = true;
    lastState[username].ConnectionTime= Date.now();

    console.debug('client connected', username);

    //saving activity
    activity.__receivetime = Date.now();
    IAActivity.create(activity)
        .then(addedactivity => {
            //ok
        }).catch(err => {
        console.error(err)
    });

    let message = {
        topic: username,
        payload: '{"DEVICE_STATUS":"CONNECTED"}',
        qos: 1, // 0, 1, or 2
        retain: false // just false is ok
    };

    server.publish(message, function() {
        console.debug('CONNECTED done!');
    });

    callback(null, authorized);
};

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
const authorizePublish = function(client, topic, payload, callback) {
    let _authorized = isAuthorized('pub',client, topic);

    /*let msg = {
        sender: client ? client.username : undefined,
        payload: payload.toString(),
        topic: topic,
        authorized: _authorized,
        time: new Date()
    };
    let message = {
        topic: 'admin/publishes',
        payload: JSON.stringify(msg),
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    server.publish(message, function() {
        console.debug('done!');
    });*/

    callback(null, _authorized /*&& client.user===JSON.parse(payload.toString()).client*/);
};

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
const authorizeSubscribe = function(client, topic, callback) {
    let authorized = isAuthorized('sub', client, topic);
    /*if(authorized){
        let message = {
            topic: topic,
            payload: 'hello '+client.id+' welcome to '+topic , // or a Buffer
            qos: 1, // 0, 1, or 2
            retain: false // or true
        };

        server.publish(message, function() {
            console.debug('done!');
        });
    }*/
    callback(null, authorized);
};

// fired when the mqtt server is ready
function setup() {
//    console.debug('BKC MQTT Broker is up and running on port '+settings.port,'version '+iabroker_version);
    console.debug('BKC MQTT Broker is up and running on port 3008 (for the control panel) and 8883 (for devices)');
    console.debug('This is the setting interfaces:', settings.interfaces);

    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
}

module.exports = server;


function base64decode(str) {
    // let str = "NWQyNjA4YjlkYTdlMmQyYjc4MjFhOTVl";

// create buffer from base64 string
    let binaryData = Buffer.from(str, "base64");

// decode buffer as utf8
    return binaryData.toString("ascii");
}
