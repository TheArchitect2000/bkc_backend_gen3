// This file is used only in <Project Root>/iabroker.js
// Don't add this file to git

module.exports.whichserver = 'bkcnode';
module.exports.debugmongoose = false;

// These lines are for token distribution in /controllers/iaactivity.controller.js
// module.exports.BonusRuntime = "1 1 * * *"; // cron, 1:01AM every day, the bkc node admin distributes BKC tokens between his users
// module.exports.BonusRuntimezone = "America/Vancouver"; // cron, time zone


//change finger print after update certificate
module.exports.fingerprint = '7D:D8:3C:76:6F:D8:42:F5:D2:05:6E:94:B5:14:68:EC:B6:FD:59:97';


let brokerconfig = {};

brokerconfig = {
        SECURE_KEY : 'config/webprivate.pem',
        SECURE_CERT : 'config/webpublic.pem',
        SECURE_KEY20 : 'config/iabroker.certificate.key',
        SECURE_CERT20 : 'config/iabroker.certificate.crt'
};

// change this true if you are going to enable Alex or Google Assitant for your IoT devices.
// Please read /iavoice/README.md to know how to setup the voice setting.
let enableVoice = true;

module.exports = brokerconfig;
