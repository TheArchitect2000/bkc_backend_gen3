const mongoose = require('mongoose');
const IAVendor = require('../models/iavendor.model');

var populatConf = {
    path: 'Members.CustomerId',
    model: 'IACustomer',
    select: 'Username FirstName LastName '
};

// Create and Save a new IA Vendor
exports.create = (req, res) => {
    let newvendor = req.body;

    let nvendor = {
        CustomerId : req.signedCookies['customer']._id,
        Name: newvendor.Name,
        Owner: newvendor.Owner,
        Type: newvendor.Type,
        IsActive: true,
        Address: {
            Country: newvendor.Country,
            Province: newvendor.Province,
            City: newvendor.City,
            Street: newvendor.Street,
            ZipCode: newvendor.ZipCode,
            GPS: {
                lat: newvendor.lat,
                lng: newvendor.lng
            }
        },
        Timezone: newvendor.Timezone,
        Members: [
            {
                CustomerId : req.signedCookies['customer']._id,
                Roles: ["ADMIN"],
                updatedAt: new Date()
            }
        ]
    }

    // Create a IAVendor
    const iavendor = new IAVendor(nvendor);

    // Save IA Vendor in the database
    iavendor.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while creating the vendor."
        });
    });
};

// Retrieve and return all IA Vendors from the database.
exports.findAll = (req, res) => {
    IAVendor.find()
        .then(iavendors => {
            res.json(iavendors);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving vendors."
        });
    });
};

// Find a single IA Vendor with a vendorId
exports.findOne = (req, res) => {
    IAVendor.findById(req.params.vendorId).populate(populatConf).then(iavendor => {
            if(!iavendor) {
                return res.status(404).send({
                    message: "Vendor not found with id " + req.params.vendorId
                });
            }
        var vendor = iavendor.getVendor(req);
        res.send(vendor);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Vendor not found with id " + req.params.vendorId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Vendor with id " + req.params.vendorId
        });
    });
};

// Update a IA Vendor identified by the vendorId in the request
exports.update = (req, res) => {
    // Find IA Vendor and update it with the request body
    IAVendor.findByIdAndUpdate(req.params.vendorId, {
        Name: req.body.Name,
        Owner: req.body.Owner,
        Type: req.body.Type
    }, {new: true}).populate(populatConf)
        .then(iavendor => {
            if(!iavendor) {
                return res.status(404).send({
                    message: "Vendor not found with id " + req.params.vendorId
                });
            }
            res.send(iavendor.getVendor(req));
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Vendor not found with id " + req.params.vendorId
            });
        }
        return res.status(500).send({
            message: "Error updating Vendor with id " + req.params.vendorId
        });
    });
};

exports.addUser = (req, res) => {
    // Find IA Vendor and update it with the request body
    mongoose.model('IACustomer').findOne({Username: req.body.email})
        .then((customer)=>{
            if(!customer){
                return res.status(404).send({
                    message: "Customer not found with Email " + req.body.email
                });
            }
            IAVendor.findByIdAndUpdate(req.params.vendorId, {
                $addToSet: {
                    Members: {
                        CustomerId: customer._id,
                        Roles: [],
                        updatedAt: new Date()
                    }
                }
            }, {new: true}).populate(populatConf).then(iavendor => {
                    if(!iavendor) {
                        return res.status(404).send({
                            message: "Vendor not found with id " + req.params.vendorId
                        });
                    }
                    return res.send(iavendor.getVendor(req));
                }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Vendor not found with id " + req.params.vendorId
                    });
                }
                return res.status(500).send({
                    message: "Error updating Vendor with id " + req.params.vendorId
                });
            });
        }).catch((err)=>{
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Vendor not found with id " + req.params.vendorId
            });
        }
        return res.status(500).send({
            message: "Error retrieving vendor with id " + req.params.vendorId
        });
    })


};

exports.changeUser = (req, res) => {
    // Find IA Vendor and update it with the request body

            IAVendor.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.params.vendorId),
                Members: {
                    $elemMatch: {
                        'CustomerId': req.body.UserId
                    }
                }
            }, {
                $set: {
                    'Members.$.updatedAt': new Date(),
                    'Members.$.Roles': req.body.Roles || []
                }
            }, {
                new: true
            }).populate(populatConf).then(iavendor => {
                    if(!iavendor) {
                        return res.status(404).send({
                            message: "Vendor not found with id " + req.params.vendorId
                        });
                    }
                    return res.send(iavendor.getVendor(req));
                }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Vendor not found with id " + req.params.vendorId
                    });
                }
                return res.status(500).send({
                    message: "Error updating vendor with id " + req.params.vendorId
                });
            })


};

exports.deleteUser = (req, res) => {
    // Find IA Vendor and update it with the request body
    IAVendor.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.vendorId),
                Members: {
                    $elemMatch: {
                        'CustomerId': req.params.userId
                    }
                }
            }, {
                $pull: {
                    'Members': {'CustomerId': req.params.userId}
                }
            }, {
                new: true
            }).populate(populatConf).then(iavendor => {
                    if(!iavendor) {
                        return res.status(404).send({
                            message: "Vendor not found with id " + req.params.vendorId
                        });
                    }
                    return res.send(iavendor.getVendor(req));
                }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Vendor not found with id " + req.params.vendorId
                    });
                }
                return res.status(500).send({
                    message: "Error updating vendor with id " + req.params.vendorId
                });
            })


};

// Delete a IA Vendor with the specified vendorId in the request
exports.delete = (req, res) => {
    IAVendor.findByIdAndRemove(req.params.vendorId)
        .then(iavendor => {
            if(!iavendor) {
                return res.status(404).send({
                    message: "Vendor not found with id " + req.params.vendorId
                });
            }
            res.send({message: "Vendor deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Vendor not found with id " + req.params.vendorId
            });
        }
        return res.status(500).send({
            message: "Could not delete vendor with id " + req.params.vendorId
        });
    });
};