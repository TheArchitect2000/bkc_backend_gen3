const IACustomer = require('../models/iacustomer.model');
const IABTt = require('../models/iabt_transfer.model');


// Create and Save a new IA Customer
exports.create = (req, res) => {
    // Validate request
    /*if(!req.body.content) {
        return res.status(400).send({
            message: "IA Customer content can not be empty"
        });
    }*/

    //check captcha , this is not good place for check, check in customer.routes.js signup
    console.error(req.captcha, req)
    if(req.captcha !== req.body.captcha){
        res.status(500).send({
            message: "Entered CAPTCHA code does not match"
        });
        return;
    }

    // Create a IACustomer
    const iacustomer = new IACustomer(req.body);

    // Save IA Customer in the database
    iacustomer.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while creating the Customer."
        });
    });
};

// Retrieve and return all IA Customers from the database.
exports.findAll = (req, res) => {
    IACustomer.find({},{Password: 0, Username: 0})
        .then(iacustomers => {
            res.json(iacustomers);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Customers."
        });
    });
};

// Retrieve and return all IA Customers from the database with Balance
exports.findAllWithBalance =  (req, res) => {
    IACustomer.find({},{Password: 0, Username: 0})
        .then(async iacustomers => {
            for(let customer of iacustomers){
                customer._doc.balance = await IABTt.getBalance(customer._id, 0, 0)
            }
            res.json(iacustomers);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Customers."
        });
    });
};

// Find a single IA Customer with a customerId
exports.findOne = (req, res) => {
    IACustomer.findById(req.params.customerId)
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            res.send(iacustomer);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
        return res.status(500).send({
            message: "Error retrieving customer with id " + req.params.customerId
        });
    });
};

// Update a IA Customer identified by the customerId in the request
exports.update = (req, res) => {
    let newcustomer = req.body;
    let newCustomerInfo = {
        FirstName : newcustomer.FirstName,
        LastName : newcustomer.LastName,
        // Email : newcustomer.Email,
        Mobile: newcustomer.Mobile,
        developer: {
            Title: newcustomer.DeveloperTitle
        },
        OutWalletAddr: newcustomer.OutWalletAddr
    };

    // Find IA Customer of cookie and update it with the request body
    IACustomer.findByIdAndUpdate(req.signedCookies['customer']._id,
        { $set: newCustomerInfo }
        , {new: true, upsert: false})
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            let _customer = {
                FirstName: iacustomer.FirstName,
                LastName: iacustomer.LastName,
                developer: iacustomer.developer,
                Mobile: iacustomer.Mobile/* ? '*****'+customer.Mobile.substr(5) : ''*/,
                Email: /*iacustomer.Email ||*/ iacustomer.Username/* ? '*****'+customer.Email.substr(5) : ''*/
            };
            const maxAgeCookie = 3600000 * 24 * 7; // would expire after 7 days
            res.cookie('customerb', JSON.stringify(_customer), {
                // maxAge: maxAgeCookie,
                // httpOnly: false, // if true The cookie only accessible by the web server
                // signed: false // Indicates if the cookie should be signed

                plain: true,
                SameSite: "Strict",
                maxAge: maxAgeCookie,
                httpOnly: false, // if true The cookie only accessible by the web server
                signed: false, // Indicates if the cookie should be signed
                secure: true
            });
            res.json({message: "OK"});
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id "
            });
        }
        return res.status(500).send({
            message: "Error updating customer with id "
        });
    });
};

//update user IsActive by admin
exports.updateActivation = (req, res) => {
    let customerId = req.body.customerId;
    let IsActive = req.body.isActive;
    IACustomer.findByIdAndUpdate(customerId,
        { $set: {IsActive: IsActive} }
        , {new: true, upsert: false})
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "Customer not found with id "
                });
            }
            res.json({message: "OK"});
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id "
            });
        }
        return res.status(500).send({
            message: "Error updating customer with id "
        });
    });
}

// Delete a IA Customer with the specified customerId in the request
exports.delete = (req, res) => {
    IACustomer.findByIdAndRemove(req.params.customerId)
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            res.send({message: "Customer deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
        return res.status(500).send({
            message: "Could not delete customer with id " + req.params.customerId
        });
    });
};
