try {
    if(typeof require !== 'undefined') {
        fingerprint = require('../../../config/which.config').fingerprint;
    }
} catch (e){
    console.error('which.server load error 1',e);
}

var domainUrl = 'https://socialmediaminers.com';
var brokerUrl = 'mqtts://socialmediaminers.com:3008'; //secure https or wss
var domainName = 'socialmediaminers';
var developmentMode = false;

try {
    exports.domainUrl = domainUrl;
    exports.domainName = domainName;
    exports.fingerprint = fingerprint;
    exports.brokerUrl = brokerUrl;
}catch (e) {}
