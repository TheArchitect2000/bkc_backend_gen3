var nodemailer = require('nodemailer');
//var {mailconfig} = require('../config/email.config');

const fs = require('fs');
let mailconfig = fs.readFileSync('./config/mailconf.json');
mailconfig = JSON.parse(mailconfig);


/**
 * mailconfig like {
    host: 'smtp.site.ooo',
    port: 587,
    auth: {
        user: 'iasmdfsdsf',
        pass: 'Spass'
    },
    tls: {rejectUnauthorized: false}
}
 */

var transporter = nodemailer.createTransport(mailconfig);

/*
 mailOptions is like this
var mailOptions = {
    from: '"BKC Smart Home" panel@domain.io',
    to: 'salartayefeh@gmail.com',
    subject: 'Hello You are OK',
    text: 'Expired Certificate Errors A roll out of new certificates last week has caused some users to experience problems sending mail—this was due to the expiration of the old certificate and an issue in our configuration. The users effected were sending through SMTP with STARTTLS. HTTPS API calls were not affected. We are currently working on a fix and will update when resolved. 12:21 PM UTC The configuration error was corrected at 12:05 UTC. SMTP with STARTTLS is now working correctly in all regions. December 18, 2015 12:04 PM UTC77!',
    html: '<p>HTML version of the message <font color="green">Hi hello</font> </p>'
};*/



exports.sendMail = (mailOptions)=> {
    mailOptions.from = '"BKC Smart Home" '+mailconfig.auth.user;

    function send() {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return error;
            } else {
                console.log('Email sent: ' + info.response);
                return 'OK';
            }
        });
    }

    if(mailOptions.template){
        let fs = require('fs');
        let template;
        fs.readFile(mailconfig.templates+'/'+mailOptions.template.name+'.email.html', function (err, content) {
            if(err){
                console.error('template path is false', err);
                return;
                // throw 'template path is false'
            }
            template = content.toString();
            for(let k in mailOptions.template.values){
                template = template.replace(new RegExp('#'+k+'#', 'g') , mailOptions.template.values[k]);
            }
            console.log(template);
            mailOptions.html = template;
            send();
        })
    } else {
        send();
    }
};
