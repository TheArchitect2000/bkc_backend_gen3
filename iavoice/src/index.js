'use strict';

//production and start from scripts npm
const {  Webhook1, ExpressJS } = require('jovo-framework');
const Webhook = require('jovo-framework').WebhookVerified;
//prototype
// const { Webhook, ExpressJS, Lambda } = require('jovo-framework');

const { app } = require ('./jovoapp.js');
const fs = require('fs');

/*///important no need to ssl hear
* because ssl is in iadomains and then dispatch to here
*
* fulfillment in google action is https://iabroker.internetanywhere.io/webhook_google
* endpoint for alexa is https://iabroker.internetanywhere.io/webhook_alexa
*
* fulfillment in google action is https://panel.blocklychain.io/webhook_google
* endpoint for alexa is https://panel.blocklychain.io/webhook_alexa
*
* */
/*Webhook.ssl = {
    key: fs.readFileSync('../../secure/iabroker.internetanywhere.io/private.key'),
    cert: fs.readFileSync('../../secure/iabroker.internetanywhere.io/certificate.crt')
    /!*key: fs.readFileSync('../../secure/iabroker.certificate.key'),
    cert: fs.readFileSync('../../secure/iabroker.certificate.crt'),*!/
    /!*key: fs.readFileSync('../../secure/localhost/localhost-key.pem'),
    cert: fs.readFileSync('../../secure/localhost/localhost.pem'),*!/
};*/

// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------

//https://www.jovo.tech/docs/hosting/express-js
// ExpressJS (Jovo Webhook)
// if (process.argv.indexOf('--webhook') > -1) {
    const port = /*process.env.JOVO_PORT ||*/ 9122;//IAVoice : I=9,A=1,V=22
    Webhook.jovoApp = app;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });

    // Webhook.post('/webhook', async (req, res) => {
    Webhook.post(['/webhook','/webhook_alexa'], async (req, res) => {
        console.info('start webhook', req.headers, req.url, req.path);
        await app.handle(new ExpressJS(req, res));
    });
// }

// AWS Lambda
/*exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};*/
