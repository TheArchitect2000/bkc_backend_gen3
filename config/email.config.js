let mailconfig = {};

mailconfig = {
    host: 'mail.bkcnode.com',
    port: 587,
    auth: {
            user: 'panel@blocklychain.io',
            pass: 'Salam@1234'
    },
    tls: {rejectUnauthorized: false},
    templates: 'views/emailtemplates/'
}

module.exports = {
    mailconfig : mailconfig
}
