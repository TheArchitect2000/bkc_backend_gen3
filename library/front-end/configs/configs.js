try {
    if(typeof require !== 'undefined') {
        fingerprint = require('../../../config/which.config').fingerprint;
    }
} catch (e){
    console.error('which.server load error 1',e);
}

var domainUrl = 'https://cl.cpvanda.com';
var brokerUrl = 'mqtts://cl.cpvanda.com:3008'; //secure https or wss
var domainName = 'cpBlocklychain';
var developmentMode = false;

try {
    exports.domainUrl = domainUrl;
    exports.domainName = domainName;
    exports.fingerprint = fingerprint;
    exports.brokerUrl = brokerUrl;
}catch (e) {}