var express = require('express');
var router = express.Router();
var path = require('path');
const IACustomer = require('../models/iacustomer.model');
const maxAgeCookie = 3600000 * 24 * 7; // would expire after 7 days
const IABTt = require('../models/iabt_transfer.model');
const iamailer = require('../iacommunication/iamailer');
let configs = require("../public/share/js/configs");
const fs = require('fs');




// login customer
let login = function (username, password, res, vendorlogin) {
    IACustomer.findOne({Username: username, IsActive: true})
        .then(customer => {
            if (!customer) {
                //res.redirect('/customer/');
                console.error('not customer', username, password);
                res.status(404).send({
                    message: "user not found"
                });
            }
            else {
                //check password
                if(!IACustomer.verifyHash(password, customer.Password)){
                    console.error('incorrect password', password);
                    res.status(401).send({
                        message: "incorrect password"
                    });
                    ///very important return:
                    return;
                }

                res.cookie('signedin', true, {
                    SameSite: "Strict",
                    maxAge: maxAgeCookie,
                    httpOnly: true, // if true The cookie only accessible by the web server
                    signed: true, // Indicates if the cookie should be signed
                    secure: true
                });
                res.cookie('customer', customer, {
                    SameSite: "Strict",
                    maxAge: maxAgeCookie,
                    httpOnly: true, // if true The cookie only accessible by the web server
                    signed: true, // Indicates if the cookie should be signed
                    secure: true
                });
                //for access from browser
                let _customer = {
                    FirstName: customer.FirstName,
                    LastName: customer.LastName,
                    developer: customer.developer,
                    Mobile: customer.Mobile/* ? '*****'+customer.Mobile.substr(5) : ''*/,
                    Email: /*customer.Email || */customer.Username/* ? '*****'+customer.Email.substr(5) : ''*/
                };
                if(customer.isAdmin){
                    _customer.isAdmin = true;
                }
                res.cookie('customerb', JSON.stringify(_customer), {
                    plain: true,
                    SameSite: "Strict",
                    maxAge: maxAgeCookie,
                    httpOnly: false, // if true The cookie only accessible by the web server
                    signed: false, // Indicates if the cookie should be signed
                    secure: true
                });
                customer._homes.then(function (homes) {
                    if (homes.length > 0) {
                        res.cookie('homeId', homes[0]._id.toString(), {
                            SameSite: "Strict",
                            maxAge: maxAgeCookie,
                            httpOnly: true, // The cookie only accessible by the web server
                            signed: true, // Indicates if the cookie should be signed
                            secure: true
                        });
                        res.cookie('homeIdb', Buffer.from(homes[0]._id.toString()).toString('base64'), {
                            plain: true,
                            SameSite: "Strict",
                            maxAge: maxAgeCookie,
                            httpOnly: false, // The cookie only accessible by the web server
                            signed: false, // Indicates if the cookie should be signed
                            secure: true
                        });
                        res.cookie('hashomeb', true, {
                            plain: true,
                            SameSite: "Strict",
                            maxAge: maxAgeCookie,
                            httpOnly: false, // The cookie only accessible by the web server
                            signed: false, // Indicates if the cookie should be signed
                            secure: true
                        });
                    }
                    //res.redirect('/customer/');

                    customer._vendors.then(function (vendors) {
                        if (vendors.length > 0) {
                            vendors = JSON.stringify(vendors);
                            res.cookie('vendors', vendors, {
                                SameSite: "Strict",
                                maxAge: maxAgeCookie,
                                httpOnly: true, // The cookie only accessible by the web server
                                signed: true, // Indicates if the cookie should be signed
                                secure: true
                            });
                            res.cookie('vendorsb', vendors, {
                                plain: true,
                                SameSite: "Strict",
                                maxAge: maxAgeCookie,
                                httpOnly: false, // The cookie only accessible by the web server
                                signed: false, // Indicates if the cookie should be signed
                                secure: true
                            });
                            res.cookie('hasvendorb', 'true', {
                                plain: true,
                                SameSite: "Strict",
                                maxAge: maxAgeCookie,
                                httpOnly: false, // The cookie only accessible by the web server
                                signed: false, // Indicates if the cookie should be signed
                                secure: true
                            });
                        } else {

                        }

                        res.json({success:true, message: "OK", redirect: vendorlogin?"/vendor":"/customer"})

                    }).catch(err => {
                        res.redirect('/customer/');
                    });

                }).catch(err => {
                    res.redirect('/customer/');
                });

            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving customer info when login."
            });
        });
};

//login
//TODO need secured
router.post('/', (req, res, next) => {
    console.log('login');

    let username = req.body.username;
    let password = req.body.password;
    let vendorlogin = req.body.vendorlogin;
    login(username, password, res, vendorlogin);
});

//signup post from panel sign up form
router.post('/signup', (req, res, next) => {
    console.log('sign up');

    //check captcha
    console.error(req.signedCookies['captcha']);
    if(req.signedCookies['captcha'] !== req.body.captcha) {
        res.status(500).send({
            message: "Entered CAPTCHA code does not match"
        });
        return;
    }

    let newpassword = IACustomer.hashPassword(req.body.Password);
    let newcustomer = new IACustomer({
        Email : req.body.Email,
        Username : req.body.Email,
        Password : newpassword,
        FirstName : req.body.FirstName,
        LastName : req.body.LastName,
        Mobile : req.body.Mobile,
        IsActive: false
    });
    newcustomer.save((err,newcustomer) => {
        if(err){
            console.error(err.errmsg);
            let errormessage = err.message || "Some error occurred while signup customer .";
            if(err.code ===11000 && err.errmsg.includes('duplicate')){
                errormessage = 'Duplicate email. This email is registered before in BKC Control Panel!'
            }
            res.status(500).send({
                success: false,
                message: errormessage,
                errmsg: err.errmsg
            });
            return;
        }

        console.log('new User ADDED');

        try {
            //send verification email
            let email = req.body.Email;
            //base 64 of _id
            let verifyid = Buffer.from( newcustomer._doc._id.toString(),'ascii').toString('base64');
            let verifyemail = {
                // from: '"BKC Smart Home" panel@domain.io',//todo domain must get from config file
                to: email,
                subject: 'BKC verification code',
                text: '',
                template: {
                    name: 'welcome',
                    values: {
                        // logourl: `${configs.domainUrl}/share/images/logo-${configs.domainName.toLowerCase()}.png`,
                        logourl: 'cid:logo',
                        domainName: configs.domainName,
                        FirstName: req.body.FirstName,
                        href: `${configs.domainUrl}/customer/activate/${verifyid}`
                    }
                },
                attachments: [{
                    filename: 'BKCLogo.png',
                    path: __dirname +`/../public/share/images/logo-${configs.domainName.toLowerCase()}.png`,
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here!
                }]
/*
                html: `<div><h4>Welcome to ${configs.domainName} </h4>
            Hi ${req.body.FirstName},<br><br>
            Please click bellow button to activate your account.<br><br>
            &nbsp;
            &nbsp;
                <a style="display: inline-block;
                background-color: #d42021;
                color: white;width: 120px; height: 30px;
    padding: .5pc;
    font-weight: bold;
    font-size: large;
    text-align: center;
    text-decoration: none;
    margin: 1pc;" href="${configs.domainUrl}/customer/activate/${verifyid}">&nbsp;&nbsp;Activate my account&nbsp;&nbsp;</a>
            `
*/
            };
            iamailer.sendMail(verifyemail);
        } catch (e){
            res.status(500).send({
                success: false,
                message: e.message || "Some error occurred while signing up."
            });
        }


        res.json({success: true, message: "User registered successfully. A confirmation email is sent now. Please check your email to activate your panel.", redirect: "/customer"});
            // login(newcustomer.Username, newcustomer.Password, res);
    });
});

//activate from email
router.get('/activate/:verifyid', (req, res, next) => {
    let verifyid = req.params.verifyid;
    verifyid = Buffer.from( verifyid,'base64').toString('ascii');
    IACustomer.findByIdAndUpdate(verifyid,
        {$set: { IsActive: true }},
        {new: true , upsert: false})
        .then(iacustomer => {
            if (!iacustomer) {
                console.error("activate:Customer not found with id "+verifyid);
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            //res.send(iacustomer);
            /*return res.status(200).send({
                message: "IA Customer activated"
            });*/
            res.redirect('/customer/');
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            console.error(err.message);
            res.status(404).send({
                message: "activate: Customer not found with id "+verifyid
            });
        }
        console.error(err.message);
        res.status(500).send({
            message: "Error on activating the customer with id "+verifyid+" ," +err.message
        });
    });
});

//reset password
router.post('/resetpasswordrequest', (req, res, next) => {
    console.log('reset password request',req.body.username);

    IACustomer.findOne({Username: req.body.username})
        .then(customer => {
            if (!customer) {
                //res.redirect('/customer/');
                console.error('not customer with email ', req.body.username);
                res.status(404).send({
                    message: "This Email is not registered before in BKC Control Panel"
                });
            } else {

                //check password
                if(customer.IsActive===true){
                    try {
                        //send verification email
                        let email = req.body.username;
                        //base 64 of _id
                        let verifyid = Buffer.from( customer._id.toString(),'ascii').toString('base64');
                        let verifyemail = {
                            // from: '"BKC Smart Home" panel@domain.io',//todo domain must get from config file
                            to: email,
                            subject: 'BKC Reset Password',
                            text: '',
                            template: {
                                name: 'reset',
                                values: {
                                    FirstName: customer.FirstName,
                                    // logourl: `${configs.domainUrl}/share/images/logo-${configs.domainName.toLowerCase()}.png`,
                                    logourl: 'cid:logo',
                                    href: `${configs.domainUrl}/customer/resetpassword/${verifyid}`
                                }
                            },
                            attachments: [{
                                filename: 'BKCLogo.png',
                                path: __dirname +`/../public/share/images/logo-${configs.domainName.toLowerCase()}.png`,
                                cid: 'logo' //my mistake was putting "cid:logo@cid" here!
                            }]
/*
                            html: `<div>
            Hi, <br>
            You have requested to reset your password in BKC Control Panel recently. <br>
            Please click on the below link:<br>
            &nbsp;
            &nbsp;
                <a style="display: inline-block;
                background-color: #d42021;
                color: white; width: 200px; height: 30px;
    padding: .5pc;
    font-weight: bold;
    font-size: large;
    text-align: center;
    text-decoration: none;
    margin: 1pc;" href="${configs.domainUrl}/customer/resetpassword/${verifyid}">&nbsp;&nbsp;Reset Password&nbsp;&nbsp;</a><br>
    <br>
    Best regards,<br>
BKC support team
            `
*/
                        };
                        iamailer.sendMail(verifyemail);
                    }
                    catch (e){
                        res.status(500).send({
                            success: false,
                            message: e.message || "Some error occurred while send reset email."
                        });
                    }


                    res.json({success: true, message: "An email has now been sent to you to reset your password. Please check your email."});
                } else {
                    res.status(401).send({
                        message: "This account has not yet been activated. Please check your email and activate your account via email previously sent to you."
                    });
                }




            }
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving customer info when login."
        });
    });
});

router.get('/resetpassword/:verifyid', (req, res, next) => {
    let verifyid = req.params.verifyid;
    // verifyid = Buffer.from( verifyid,'base64').toString('ascii');

    // res.sendFile(path.resolve('public/customer/views/iacustomer.customer.resetpassword.html'));

    fs.readFile('public/customer/views/iacustomer.customer.resetpassword.html', (err, html) => {
        let htmlPlusData = html.toString().replace("BXCID", verifyid);
        res.send(htmlPlusData);
    });

    /*
    IACustomer.findByIdAndUpdate(verifyid,
        {$set: { IsActive: true }},
        {new: true , upsert: false})
        .then(iacustomer => {
            if (!iacustomer) {
                console.error("activate:IA Customer not found with id "+verifyid);
                return res.status(404).send({
                    message: "IA Customer not found with id "
                });
            }
            //res.send(iacustomer);
            /!*return res.status(200).send({
             message: "IA Customer activated"
             });*!/
            res.redirect('/customer/');
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            console.error(err.message);
            res.status(404).send({
                message: "activate: IA Customer not found with id "+verifyid
            });
        }
        console.error(err.message);
        res.status(500).send({
            message: "Error updating activate IA Customer with id "+verifyid+" ," +err.message
        });
    });*/
});

router.post('/savepassword', (req, res, next) => {
    let verifyid = req.body.verifyid;
    verifyid = Buffer.from( verifyid,'base64').toString('ascii');
    let newpassword = IACustomer.hashPassword(req.body.Password);

    IACustomer.findByIdAndUpdate(verifyid,
        {$set: { Password: newpassword, ChangePasswordTime: Date.now() }},
        {new: true , upsert: false})
        .then(iacustomer => {
            if (!iacustomer) {
                console.error("savepassword: Customer not found with id "+verifyid);
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            res.json({success: true, message: "Password changed successfully", redirect: "/customer/"})
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            console.error(err.message);
            res.status(404).send({
                message: "activate: Customer not found with id "+verifyid
            });
        }
        console.error(err.message);
        res.status(500).send({
            message: "Error updating activate Customer with id "+verifyid+" ," +err.message
        });
    });
});

///customer/notifysubscription
router.post('/notifysubscription', (req, res, next) => {
    console.log('/customer/notifysubscription');

    let customer = req.signedCookies['customer'];
    let subscription = req.body.sub;
    console.log(customer._id, subscription);
    IACustomer.findByIdAndUpdate(customer._id,
        {$set: { NotifySubscription: subscription }},
        {new: true , upsert: false})
        .then(iacustomer => {
            if (!iacustomer) {
                console.error("Customer not found with id Error 2");
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            //res.send(iacustomer);
            return res.status(200).send({
                message: "Customer updated subscription"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                console.error(err.message);
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            console.error(err.message);
            return res.status(500).send({
                message: "Error updating publish Customer with id ," +err.message
            });
    });
});

// logout customer
router.get('/logout', (req, res, next) => {
    console.log('logout');
    //hint: clearCookie not working true for object cookies
    res.set('Cache-control', `no-cache, max-age=0`);
    res.clearCookie('signedin');
    res.clearCookie('homeId');
    res.clearCookie('homeIdb');
    res.clearCookie('hashomeb');
    res.clearCookie('costomer');
    res.clearCookie('costomerb');
    res.redirect('/customer/?logout=1');//logout=1 for preventing cache and loop to index
});

// control index page of vendor
router.get('/vendor', (req, res, next) => {
    //check url
    if(req.query.sign){
        let sign = new Buffer(req.query.sign, 'base64').toString('ascii');
        sign = JSON.parse(sign);
        sign.IsActive = true;
        sign.UserId = sign.Id;
        delete sign.Id;

        //todo security !!!!!

        IACustomer.find({UserId: sign.UserId}).then(cstmr=>{
            if(cstmr.length > 0) {
                console.log('old User '+cstmr[0].UserId);
                if(sign.Password !==cstmr[0].Password){
                    IACustomer.update({UserId: sign.UserId} , {$set: {Password: sign.Password}}, { multi: false, new: true, upsert:false }, function () {
                        console.log('password changed');
                    })
                }
                login(cstmr[0].Username, cstmr[0].Password, res);
            }
            else {
                console.log('new User')
                IACustomer.create(sign)
                    .then(newcustomer => {
                        console.log('new User ADDED')
                        login(newcustomer.Username, newcustomer.Password, res);
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while adding customer info."
                    });
                });
            }
        });
        return;
    }

    let signedin = req.signedCookies['signedin'];
    let customer = req.signedCookies['customer'];//todo rename to user
    if(signedin && customer && customer.vendor) {
        console.log('enter customer', customer._id, customer.homeId);
        next();
    } else {
        // res.redirect("/customer/views/iacustomer.customer.login.html")
        res.sendFile(path.resolve('public/customer/views/iacustomer.customer.login.html'))
    }

});

// control index page
router.get('/', (req, res, next) => {
    //check url
    /*if(req.query.sign){
        let sign = new Buffer(req.query.sign, 'base64').toString('ascii');
        sign = JSON.parse(sign);
        sign.IsActive = true;
        sign.UserId = sign.Id;
        delete sign.Id;

        //todo security !!!!!

        IACustomer.find({UserId: sign.UserId}).then(cstmr=>{
            if(cstmr.length > 0) {
                console.log('old User '+cstmr[0].UserId);
                if(sign.Password !==cstmr[0].Password){
                    IACustomer.update({UserId: sign.UserId} , {$set: {Password: sign.Password}}, { multi: false, new: true, upsert:false }, function () {
                        console.log('password changed');
                    })
                }
                login(cstmr[0].Username, cstmr[0].Password, res);
            }
            else {
                console.log('new User')
                IACustomer.create(sign)
                    .then(newcustomer => {
                        console.log('new User ADDED')
                        login(newcustomer.Username, newcustomer.Password, res);
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while adding customer info."
                    });
                });
            }
        });
        return;
    }*/

    let signedin = req.signedCookies['signedin'];
    let customer = req.signedCookies['customer'];//todo rename to user
    let baseUrl = req.baseUrl;
    let loginpage = 'public/customer/views/iacustomer.customer.login.html';
    if(baseUrl.startsWith('/admin')){
        if(!(signedin && customer && customer.isAdmin)){
            res.redirect('/customer')
            return;
        }
    }
    if(signedin && customer){
        console.log('enter customer', customer._id, customer.homeId);
        next();
    } else {
        // res.redirect("/customer/views/iacustomer.customer.login.html")
        res.sendFile(path.resolve(loginpage))
    }

});

/*
// Retrieve a single Customer with customerId
router.get('/:customerId', customer.findOne);

// Update a Customer with customerId
router.put('/:customerId', customer.update);

// Delete a Customer with customerId
router.delete('/:customerId', customer.delete);
*/


// BKC transfers
router.get('/iabt/list', (req, res, next) => {
    IABTt.getBalance(req.signedCookies['customer']._id, 0, 2000)
        .then((balanceObject)=>{
            res.json(balanceObject)
        })
        .catch((balanceObject)=>{
            res.json({})
        })
});

router.get('/iabt/last', (req, res, next) => {
    IABTt.getBalance(req.signedCookies['customer']._id, 0, 3)
        .then((balanceObject)=>{
            res.json(balanceObject)
        })
        .catch((balanceObject)=>{
            res.json({})
        })
});

//extract tokens to a new voucher
router.post('/iabt/voucher', async (req, res, next) => {
    try {
        let tResult = await IABTt.transfer(
            req.signedCookies['customer']._id,
            null,
            req.body.amount,
            IABTt.TransferCases().VOUCHER_EXTRACT,
            /*req.body.comment || */`Extract voucher for "${req.body.amount}" tokens.`
        );
        res.send({message:"Voucher extracted successfully", voucher_id: tResult.IABT_Transfer_Id});
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.TransferString || "Some error occurred while extracting new voucher."
        });
    }
});

// import tokens
router.put('/iabt/voucher', async (req, res, next) => {
    try {
        let tResult = await IABTt.transfer(
            null,
            req.signedCookies['customer']._id,
            0,
            IABTt.TransferCases().VOUCHER_IMPORT,
            `Import voucher "${req.body.voucher_id}".`,
            req.body.voucher_id
        );
        res.send({message:"Voucher imported successfully", voucher_id: req.body.voucher_id});
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.TransferString || "Some error occurred while importing voucher."
        });
    }
});

// transfer tokens to email wallet
router.post('/iabt/transfertoemail', async (req, res, next) => {
    //prevent send email to himself
    if(req.signedCookies['customer'].Username.toLowerCase() === req.body.email.trim().toLowerCase()) {
        res.status(500).send({
            message: "Destination wallet is your wallet, transfer failed!"
        });
        return;
    }
    try {
        let comment = `Receive token from ${req.signedCookies['customer'].Username}`;
        let tResult = await IABTt.transfer(
            req.signedCookies['customer']._id,
            req.body.email,
            req.body.amount,
            IABTt.TransferCases().TRANSFER_TO_EMAIL,
            comment,//TODO a comment by user
        );
        res.send({message:"Transfer to email was successful"});
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.TransferString || "Some error occurred while transfer token to email."
        });
    }
});

//burn tokens
router.get('/iabt/burntoken/:customerId/:amount', async (req, res, next) => {
    try {
        let amount = Math.abs(parseInt(req.params.amount));//abs used to prevent minus amounts
        let tResult = await IABTt.transfer(
            req.params.customerId,
            null,
            amount,
            IABTt.TransferCases().BURN_TOKEN,
            `Burn tokens`
        );
        res.send({message:"Burned successfully", burn_id: tResult.IABT_Transfer_Id});
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.TransferString || "Some error occurred while burning."
        });
    }
});

const iavoice = require('../controllers/iavoice.controller');
// this method called by jovo to recognize which account linking
router.post('/whoisme', iavoice.whoisme);
router.post('/deviceaction', iavoice.deviceaction);


// Play last file of playlist
router.get('/playlist/last/:pl_id', require('../controllers/iafileserver.controller').PlayLastOfPlaylist);

//captcha png
router.get('/captcha.png' , (req, res, next) => {
    let captcha = parseInt(Math.random()*9000+1000);
    console.log('captcha', captcha);
    res.cookie('captcha', captcha, {
        SameSite: "Strict",
        maxAge: 600000,
        httpOnly: true, // if true The cookie only accessible by the web server
        signed: true, // Indicates if the cookie should be signed
        secure: true
    });


    let captchapng = require('captchapng');
    let p = new captchapng(80,30,captcha); // width,height,numeric captcha
    p.color(255, 255, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    let img = p.getBase64();
    let imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
})

module.exports = router;

//todo change customer.routes.js to user.routes.js
