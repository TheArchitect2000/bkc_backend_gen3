let mailconfig = {};

mailconfig = {
    host: 'mail.cpvanda.com',
    port: 587,
    auth: {
            user: 'admin@cpvanda.com',
            pass: 'salam1234'
    },
    tls: {rejectUnauthorized: false},
    templates: 'views/emailtemplates/'
}

module.exports = {
    mailconfig : mailconfig
}
