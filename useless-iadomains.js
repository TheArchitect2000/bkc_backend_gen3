/**
* get secure by https://www.sslforfree.com
 * https://app.zerossl.com/login
* login u: mehdi@int************r.io pass: 1****6
* https://localhost by https://github.com/FiloSottile/mkcert
 *
 * C:\ProgramData\chocolatey\lib\mkcert\tools>mkcert -install localhost
 *
 *
 * how to renew certbot? /home/iabroker/ certbot certonly
 * stop pm2 ia80to443
 * option 1
 * copy to ./secure/iabroker.internetanywhre.io
*/

/**
 * first stop iadomain and ia80to443
 * then by running # certbot certonly --standalone --preferred-challenges http -d iabroker.internetanywhere.io
 * then by running # certbot certonly --standalone --preferred-challenges http -d panel.blocklychain.io
 *  - Congratulations! Your certificate and chain have been saved at:
 /etc/letsencrypt/live/iabroker.internetanywhere.io/fullchain.pem
 Your key file has been saved at:
 /etc/letsencrypt/live/iabroker.internetanywhere.io/privkey.pem
 Your cert will expire on 2021-05-09. To obtain a new or tweaked
 version of this certificate in the future, simply run certbot
 again. To non-interactively renew *all* of your certificates, run
 "certbot renew"
 - If you like Certbot, please consider supporting our work by:

 Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 Donating to EFF:                    https://eff.org/donate-le
 * @type {*}
 */

var bouncy = require('bouncy');
var fs = require('fs');

let whichserver = require('./config/which.config').whichserver;
var opts = {
    //local
    cert : fs.readFileSync('secure/localhost/localhost.pem'),
    key : fs.readFileSync('secure/localhost/localhost-key.pem')
};
if(whichserver === 'iabt') {
    opts = {
        /*key: fs.readFileSync('secure/iabroker.iabt.io/private.key'),
        ca: fs.readFileSync('secure/iabroker.iabt.io/ca_bundle.crt'),*/
        key: fs.readFileSync('/usr/local/directadmin/data/users/admin/domains/iabroker.iabt.io.key'),
        ca: fs.readFileSync('/usr/local/directadmin/data/users/admin/domains/iabroker.iabt.io.cert'),
    }
} else if(whichserver === 'devcopa') {
    opts = {
        /*key: fs.readFileSync('secure/iabroker.iabt.io/private.key'),
         ca: fs.readFileSync('secure/iabroker.iabt.io/ca_bundle.crt'),*/
        key: fs.readFileSync('/usr/local/directadmin/data/users/admin/domains/panel.devcopa.com.key'),
        ca: fs.readFileSync('/usr/local/directadmin/data/users/admin/domains/panel.devcopa.com.cert'),
    }
} else if(whichserver==='internetanywhere'){
    opts = {
        // cert: fs.readFileSync('secure/iabroker.internetanywhere.io/certificate.crt'),
        // key: fs.readFileSync('secure/iabroker.internetanywhere.io/private.key'),
        // ca: fs.readFileSync('secure/iabroker.internetanywhere.io/ca_bundle.crt'),

        // cert: fs.readFileSync('secure/iabroker.internetanywhere.io/cert.pem'),
        // key: fs.readFileSync('secure/iabroker.internetanywhere.io/privkey.pem'),
        // ca: fs.readFileSync('secure/iabroker.internetanywhere.io/chain.pem'),

        cert: fs.readFileSync('/etc/letsencrypt/live/iabroker.internetanywhere.io/cert.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/iabroker.internetanywhere.io/privkey.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/iabroker.internetanywhere.io/chain.pem'),
    }
} else if(whichserver==='blocklychain'){
    opts = {
        cert: fs.readFileSync('/etc/letsencrypt/live/panel.blocklychain.io/cert.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/panel.blocklychain.io/privkey.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/panel.blocklychain.io/chain.pem'),
    }
}


var server = bouncy(opts,function (req, res, bounce) {
    // console.log('-------------------------');
    if (req.headers.host === 'iabroker.internetanywhere.io' && (req.url==='/webhook' || req.url==='/webhook_alexa')) {
        bounce(9122);
    }
    else if (req.headers.host === 'panel.blocklychain.io' && (req.url==='/webhook' || req.url==='/webhook_alexa')) {
        bounce(9122);
    }
    else {
        let restport = require('./config/which.config').RESTPORT || 50500;
        if (req.headers.host === 'panel.blocklychain.io') {
                bounce(restport);
            }
            else if (req.headers.host === 'iabroker.internetanywhere.io') {
                bounce(restport);
            }
            else if (req.headers.host === 'iabroker.iabt.io') {
                bounce(restport);
            }
            else if (req.headers.host === 'dashboard.socialmediaminers.com') {
                bounce(3000);
            }
            else if (req.headers.host === 'localhost') {
                bounce(restport);
            }
            else {
                res.statusCode = 404;
                res.end('no such host');
            }
    }
});
server.listen(443, function() {
    console.log('Listening on port %d', 443);
}).on('error', function (err) {
    console.error(err);
});
// server.listen(443);
