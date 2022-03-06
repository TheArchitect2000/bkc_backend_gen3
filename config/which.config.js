// This file is used only in <Project Root>/iabroker.js
// Don't add this file to git

module.exports.whichserver = 'bkcnode';
module.exports.debugmongoose = false;

// These lines are for token distribution in /controllers/iaactivity.controller.js
// module.exports.BonusRuntime = "1 1 * * *"; // cron, 1:01AM every day, the bkc node admin distributes BKC tokens between his users
// module.exports.BonusRuntimezone = "America/Vancouver"; // cron, time zone


//change finger print after update certificate
module.exports.fingerprint = '68:A3:34:A2:8B:80:C1:8F:38:EC:9C:3F:E3:7E:85:F9:46:A8:CB:3B';

let brokerconfig = {};

brokerconfig = {
        SECURE_KEY : 'config/webprivate.pem',
        SECURE_CERT : 'config/webpublic.pem',
        SECURE_KEY20 : 'config/iabroker.certificate.key',
        SECURE_CERT20 : 'config/iabroker.certificate.crt'
};

module.exports = brokerconfig;