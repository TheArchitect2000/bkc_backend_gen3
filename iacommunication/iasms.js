var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({apikey: '6E51477970536C622B5770455A44414B32445A622F583451564D72396451577239623070584C6B504738633D'});

const sender = "10008663";

exports.sendSMS = (smsOptions)=> {
    let sms = {message: smsOptions.message, sender: sender, receptor: smsOptions.MobileNo};
    console.log('iasms service',sms);
    api.Send(sms,
        function(response, status) {
            console.log(response);
            console.log(status);
        });
}