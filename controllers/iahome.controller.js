const IAHome = require('../models/iahome.model');

// Create and Save a new IA Home
exports.create = (req, res) => {
    // Create a IAHome
    let newhome = req.body;

    let nhome = {
        CustomerId : req.signedCookies['customer']._id,
        Name: newhome.Name,
        Type: newhome.Type,
        IsActive: true,
        Guard: false,
        Address: {
            Country: newhome.Country,
            Province: newhome.Province,
            City: newhome.City,
            Street: newhome.Street,
            ZipCode: newhome.ZipCode,
            GPS: {
                lat: newhome.lat,
                lng: newhome.lng
            }
        },
        Timezone: newhome.Timezone
    }

    // Save IA Home in the database
    IAHome.create(nhome)
        .then(addedhome => {
            res.send("Home Added Successfully. please login again!");
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating new smart home."
        });
    });
};

// Retrieve and return all IA Homes from the database.
exports.findAll = (req, res) => {
    IAHome.find()
        .then(iahomes => {
            res.json(iahomes);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving smart homes."
        });
    });
};

// Find a single IA Home with a homeId
exports.findOne = (req, res) => {

    let _homeId = req.params.homeId;
    if(! _homeId || _homeId ==='null')
        _homeId = req.signedCookies['homeId'];
    IAHome.findById(_homeId)
        .then(async (iahome)=> {
            if(!iahome) {
                return res.status(404).send({
                    message: "Smart home not found with id " + req.params.homeId
                });
            }

            /*iahome._devices.then(devs=>{
                iahome._doc._devices = devs;
                res.send(iahome);
            }).catch(e=>res.send(iahome));*/
            ////
            iahome._doc._devices = await iahome._devices;
            iahome._doc._installedServices = await iahome._installedServices;
            res.send(iahome);
            ////

        }).catch(err => {
            console.error('find one home ', err);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Smart home not found with id " + req.params.homeId
            });
        }
        return res.status(500).send({
            message: "Error retrieving smart home with id " + req.params.homeId
        });
    });
};

// Update a IA Home identified by the homeId in the request
exports.update = (req, res) => {
    let newhome = req.body;
    // newhome.CustomerId = req.signedCookies['customer']._id;

    let nhome = {
        Name: newhome.Name,
        Type: newhome.Type,
        Address: {
            Country: newhome.Country,
            Province: newhome.Province,
            City: newhome.City,
            Street: newhome.Street,
            ZipCode: newhome.ZipCode,
            GPS: {
                lat: newhome.lat,
                lng: newhome.lng
            }
        },
        Timezone: newhome.Timezone
    }
    // Find IA Home and update it with the request body
    IAHome.findByIdAndUpdate(req.params.homeId,
        nhome,
        {new: false})
        .then(iahome => {
            if(!iahome) {
                return res.status(404).send({
                    message: "Smart home not found with id " + req.params.homeId
                });
            }
            //res.send(iahome);
            return res.status(200).send({
                message: "Smart home data updated"
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Smart home not found with id " + req.params.homeId
            });
        }
        return res.status(500).send({
            message: "Error updating smart home with id " + req.params.homeId
        });
    });
};

// Update Guard of IA Home identified by the cookie
exports.changeGuard = (req, res) => {
    if(req.signedCookies['homeId'] == null){
        return res.status(404).send({
            message: "Error : Not true login ,or not any home registered in this account"
        });
    }

    // Find IA Home and update it with the request body
    IAHome.findByIdAndUpdate(req.signedCookies['homeId'] ,
        { $set: {Guard: req.params.newGuard} },
        {new: true, upsert:false})
        .then(iahome => {
            if(!iahome) {
                return res.status(404).send({
                    message: "Smart home not found with this id"
                });
            }
            //res.send(iahome);
            return res.status(200).send({
                message: "Guard status updated",
                Guard: iahome.Guard
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Smart home not found with this id"
            });
        }
        return res.status(500).send({
            message: "Error updating smart home with this id "
        });
    });
};

// Delete a IA Home with the specified homeId in the request
exports.delete = (req, res) => {
    IAHome.findByIdAndRemove(req.params.homeId)
        .then(iahome => {
            if(!iahome) {
                return res.status(404).send({
                    message: "Smart home not found with id " + req.params.homeId
                });
            }
            res.send({message: "Smart home deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Smart home not found with id " + req.params.homeId
            });
        }
        return res.status(500).send({
            message: "Could not delete smart home with id " + req.params.homeId
        });
    });
};