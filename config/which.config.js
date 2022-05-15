// Don't add this file to git

let brokerconfig = {};

brokerconfig = {
        SECURE_KEY : 'config/webprivate.pem',
        SECURE_CERT : 'config/webpublic.pem',
        SECURE_KEY20 : 'config/iabroker.certificate.key',
        SECURE_CERT20 : 'config/iabroker.certificate.crt',

        // These lines are for token distribution in /controllers/iaactivity.controller.js
        BonusRuntime : "55 05 * * *", // cron, 05:55AM every day, the bkc node admin distributes BKC tokens between his users
        BonusRuntimezone : "America/New_York", // cron, time zone
        // Change your finger print
        //fingerprint : '41:DC:04:1A:BC:2B:27:04:AE:F6:0B:DC:48:14:77:A3:59:B9:2B:B5',
        fingerprint : '<YOUR FINGERPRINT>',
        whichserver : 'bkcnode',
        debugmongoose : false
};

// change this true if you are going to enable Alex or Google Assitant for your IoT devices.
// Please read /iavoice/README.md to know how to setup the voice setting.
let enableVoice = true;

module.exports = brokerconfig;
