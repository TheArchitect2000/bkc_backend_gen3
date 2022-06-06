// This file is used only in <Project Root>/iabroker.js
// Don't add this file to git

module.exports.whichserver = 'bkcnode';
module.exports.debugmongoose = false;

// These lines are for token distribution in /controllers/iaactivity.controller.js
// module.exports.BonusRuntime = "1 1 * * *"; // cron, 1:01AM every day, the bkc node admin distributes BKC tokens between his users
// module.exports.BonusRuntimezone = "America/Vancouver"; // cron, time zone


//change finger print after update certificate
module.exports.fingerprint = '2C:93:89:B1:68:7B:81:BE:D3:69:AB:18:41:17:A3:AB:E6:2D:87:41';



// SECURE_KEY & SECURE_CERT: 3 month key and crt certificates.
// SECURE_KEY20 & SECURE_CERT20: 20 years key and crt certificates.
let brokerconfig = {};
brokerconfig = {
        SECURE_KEY : 'configs/webprivate.pem',
        SECURE_CERT : 'configs/webpublic.pem',
        SECURE_KEY20 : 'configs/iabroker.certificate.key',
        SECURE_CERT20 : 'configs/iabroker.certificate.crt'
};

// change this true if you are going to enable Alex or Google Assitant for your IoT devices.
// Please read /iavoice/README.md to know how to setup the voice setting.
let enableVoice = false;

module.exports = brokerconfig;
