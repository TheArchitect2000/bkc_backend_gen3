const IADeviceType = require('../models/iadevicetype.model');

// Create and Save a new IA DeviceType
exports.create = (req, res) => {
    // Create a IADeviceType
    let newdevicetype = req.body;
    newdevicetype.Price = {Add: 0, Run: 0};
    // newdevicetype.NeedAccesses = [];
    newdevicetype.DeveloperId = req.signedCookies['customer']._id;



    // Save IA DeviceType in the database
    IADeviceType.create(newdevicetype).then(addeddevicetype => {
        res.send("DeviceType Added Successfully");
    }).catch(err => {
        let message = err.message;
        if(err.code === 11000){
            message = 'The word "'+ newdevicetype.DeviceType+'" has been assigned to another devicetype . Please choose another Device Type.'
        }
        res.status(500).send({
            message: message || "Some errors occurred while creating new DeviceType."
        });
    });
};

// Retrieve devicetypes for this vendorid or login user
exports.findVendorDeviceTypes = (req, res) => {
    let _vendorId = req.params.vendorId || req.signedCookies['vendors'][0]._id;//todo add security
    IADeviceType.find({VendorId: _vendorId})
        .then(async iadevicetypes => {
            await prepareDevTypes(iadevicetypes);
            res.json(iadevicetypes);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving DeviceTypes for this developer."
        });
    });
    /*IADeviceType.find({VendorId: _vendorId})
        .populate('DeveloperId','FirstName LastName _id')
        .exec(function (err, iadevicetypes) {
            if(err){
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving IA DeviceTypes for this developer."
                });
                return;
            }
            res.json(iadevicetypes);
        });*/
};

// Retrieve devicetypes which are published to devicetype gallery
exports.findPublishedDeviceTypes = (req, res) => {
    let _developerId = req.params.developerId || req.signedCookies['customer']._id;
    IADeviceType.find({'$or': [{Published: true}, {DeveloperId: _developerId}]}, "  -Icon -Iconpadding -Blockly ")
        .then(async iadevicetypes => {
            await prepareDevTypes(iadevicetypes);
            res.json(iadevicetypes);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving DeviceTypes for this developer."
        });
    });
};

// Retrieve and return all IA DeviceTypes from the database.
async function prepareDevTypes(iadevicetypes) {
    for (let ias of iadevicetypes) {
        let _i = await ias.InstalledCount();
        let _dev = await ias.getDeveloper();
        let _ven = await ias.getVendor();
        ias._doc._Developer = _dev.developer?_dev.developer.Title:'';
        ias._doc._Vendor = _ven.Name || '?';
        ias._doc._Installed = _i;
        ias._doc._Stars = _i < 1 ? 0 : _i < 5 ? 1 : _i < 10 ? 2 : _i < 20 ? 3 : _i < 50 ? 4 : 5;
    }
}

exports.findAll = (req, res) => {
    IADeviceType.find({Published: true})
        .then(async iadevicetypes => {
            await prepareDevTypes(iadevicetypes);
            res.json(iadevicetypes);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving DeviceTypes."
        });
    });
};

// Find a single IA DeviceType with a devicetypeId
exports.findOne = (req, res) => {

    IADeviceType.findById(req.params.Id)
        .populate('OTA.Releases.CustomerId','FirstName LastName')
        .then(iadevicetype => {
            if (!iadevicetype) {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }

            res.send(iadevicetype);

        }).catch(err => {
        console.error('find one devicetype ', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "DeviceType not found with id " + req.params.Id
            });
        }
        return res.status(500).send({
            message: "Error retrieving DeviceType with id " + req.params.Id
        });
    });
};

// Update a IA DeviceType identified by the devicetypeId in the request
exports.update = (req, res) => {
    // Validate Request TODO
    /*if(!req.body.content) {
     return res.status(400).send({
     message: "IA DeviceType content can not be empty"
     });
     }*/

    let newdevicetype = req.body;
    if(!newdevicetype.Data) newdevicetype.Data = [];
    // if(!newdevicetype.Comments) newdevicetype.Comments = [];
    if(!newdevicetype.Price) newdevicetype.Buttons = {Add:0,Run:0};


    // Find IA DeviceType and update it with the request body
    IADeviceType.findByIdAndUpdate(req.params.Id,
        newdevicetype,
        {new: false})
        .then(iadevicetype => {
            if (!iadevicetype) {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }
            //res.send(iadevicetype);
            return res.status(200).send({
                message: "DeviceType updated"
            });
        }).catch(err => {
            let message = err.message;
            if(err.code === 11000){
                message = 'The DeviceType "'+ newdevicetype.DeviceType+'" assigned to another devicetype before. Please choose another Device Type or cancel changes.'
            }
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "DeviceType not found with id "
                });
            }
            return res.status(500).send({
                message: message
            });
        });
};

exports.publishVersion = async (req, res) => {
    IADeviceType.findByIdAndUpdate(req.params.Id,
        {$inc: { __v: 1}, Published: true},
        {new: false , upsert: false})
        .then(iadevicetype => {
            if (!iadevicetype) {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }
            //res.send(iadevicetype);
            return res.status(200).send({
                message: "DeviceType updated published"+iadevicetype
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "DeviceType not found with id " + req.params.Id
            });
        }
        return res.status(500).send({
            message: "Error updating publish DeviceType with id " + req.params.Id + " "+err.message
        });
    });
};

// Delete a IA DeviceType with the specified devicetypeId in the request
exports.delete = (req, res) => {
    IADeviceType.findByIdAndRemove(req.params.Id)
        .then(iadevicetype => {
            if (!iadevicetype) {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }
            res.send({message: "DeviceType deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "DeviceType not found with id " + req.params.Id
            });
        }
        return res.status(500).send({
            message: "Could not delete DeviceType with id " + req.params.Id
        });
    });
};



// Retrieve Icon of devicetype
exports.getIcon = (req, res) => {
    IADeviceType.findById(req.params.Id)
        .then(iadevicetype => {
            if (!iadevicetype) {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }

            if(iadevicetype.Icon === ''){
                res.status(404).send({message:"DeviceType have not image"});
            } else {
                var img = Buffer.from(iadevicetype.Icon.split(",")[1], 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });

                res.end(img);
            }

        }).catch(err => {
            console.error('find one devicetype ', err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "DeviceType not found with id " + req.params.Id
                });
            }
            return res.status(500).send({
                message: "Error retrieving DeviceType with id " + req.params.Id
            });
        });
};