try {
    if(typeof require !== 'undefined') {
        fingerprint = require('../../../config/which.config').fingerprint;
    }
} catch (e){
    console.error('which.server load error 1',e);
}

var domainUrl = 'https://cl.blocklychain.io';
var brokerUrl = 'mqtts://cl.blocklychain.io:3008'; //secure https or wss
var domainName = 'clBlocklychain';
var developmentMode = false;

try {
    exports.domainUrl = domainUrl;
    exports.domainName = domainName;
    exports.fingerprint = fingerprint;
    exports.brokerUrl = brokerUrl;
}catch (e) {}
