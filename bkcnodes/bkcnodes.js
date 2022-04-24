const mqtt = require('mqtt');
var SECURE_CERT = __dirname + '/../secure/iabroker.certificate.crt';
// console.log(SECURE_CERT)

var PORT = 8883;

var options = {
    certPath: SECURE_CERT,
};

class BKCNodeClient {
    constructor(opt) {
        this.node_conf = opt.node;
        // this.node_conf.certPath = SECURE_CERT;
    }
    node_conf = {
        // brokerUrl: 'mqtts://localhost:3008',
        // username: username,
        // password: password,
        // clientId: username,
        // clean: true,//TODO clean was false check all thing is ok
        // resubscribe: true,
        // rejectUnauthorized: false
        // certPath: SECURE_CERT,
    };

    test(){
        this.client = mqtt.connect(this.node_conf.brokerUrl, this.node_conf);

        this.client.on('connectx', ()=>{
            console.log('connected')
        })
        this.client.on('disconnect', ()=>{
            console.log('disconnected')
        })
        this.client.on('error', (err)=>{
            console.log('error', err)
        })
        this.client.subscribe('messages');
        this.client.publish('messages', 'Current time is: ' + new Date());
        this.client.on('message', function(topic, message) {
            console.log(topic, message);
        });
    }
}

let bnc = new BKCNodeClient({
    node: {
        brokerUrl: 'mqtts://localhost:3008',
        clientId: 'x-nodeclient',
        username: 'username',
        password: 'password',
        clean: true,//TODO clean was false check all thing is ok
        resubscribe: true,
        rejectUnauthorized: false
    }
})
bnc.test();


