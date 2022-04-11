let mailconfig = {};

mailconfig = {
    host: 'mail.bkcnode.com',
    port: 587,
    auth: {
        user: 'panel@bkcnode.io',
        pass: 'Hello123'
    },
    tls: {rejectUnauthorized: false},
    templates: 'views/emailtemplates/'
}

module.exports = {
    mailconfig : mailconfig
}
