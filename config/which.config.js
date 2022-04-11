// This file is used only in <Project Root>/iabroker.js
// Don't add this file to git

module.exports.whichserver = 'bkcnode';
module.exports.debugmongoose = false;

// These lines are for token distribution in /controllers/iaactivity.controller.js
// module.exports.BonusRuntime = "1 1 * * *"; // cron, 1:01AM every day, the bkc node admin distributes BKC tokens between his users
// module.exports.BonusRuntimezone = "America/Vancouver"; // cron, time zone


//change finger print after update certificate
module.exports.fingerprint = 'FB:63:86:B4:94:13:15:77:5D:BE:6A:FE:68:61:FB:E2:D8:AF:E1:F0';



let brokerconfig = {};

brokerconfig = {
        SECURE_KEY : 'config/webprivate.pem',
        SECURE_CERT : 'config/webpublic.pem',
        SECURE_KEY20 : 'config/iabroker.certificate.key',
        SECURE_CERT20 : 'config/iabroker.certificate.crt'
};

module.exports = brokerconfig;