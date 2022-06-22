var domainUrl = 'https://programming.cpvanda.com';
var brokerUrl = 'mqtts://programming.cpvanda.com:3008'; //secure https or wss
var domainName = 'cpBlocklychain';
var fingerprint = '';
var developmentMode = false;

try {
    if(typeof require !== 'undefined') {
        fingerprint = require('../../../configs/which.config').fingerprint;
    }
} catch (e){
    console.error('which.server load error 1',e);
}

try {
    exports.domainUrl = domainUrl;
    exports.domainName = domainName;
    exports.fingerprint = fingerprint;
    exports.brokerUrl = brokerUrl;
}catch (e) {}