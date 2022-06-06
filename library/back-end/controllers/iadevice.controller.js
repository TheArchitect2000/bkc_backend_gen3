const IADevice = require('../models/iadevice.model');
const IADeviceType = require('../models/iadevicetype.model');
const IAActivity = require('../models/iaactivity.model');
const randompassword = require('secure-random-password');
let configs = require("../../../configs/configs");


function generatePassword(len) {
    return randompassword.randomPassword({
        length: len,
        characters: randompassword.lower + randompassword.upper + randompassword.digits + '^&*()'
    })
}

// Part of https://github.com/chris-rock/node-crypto-examples

async function createDevice(homeId, name, type, mac, res, series) {
    let prevent = false;
    //prevent if device with this mac available in database already
    await IADevice.find({"MAC":mac, Removed: false})
        .then(iadevices => {
            if(iadevices.length > 0) {
                if(res) {
                    res.status(500).send({
                        message: "A device with this MAC address has already been registered !"
                    });
                }
                prevent = true;
            }
        }).catch(err => {    });
    if(prevent) return;

    let hashMac = Buffer.from(mac).toString('base64');

    //check current.devices with this hashMac
    //x26 disabled return
    if (!global.current.clients[hashMac]) {
        res.status(500).send({
            message: "<b>A device with this MAC address is not detected.</b><ul><li>Check correctness of MAC address</li><li>Ensure your device is turned on and connected to the Internet</li></ul>"
        });
        return;
    }

    let password = generatePassword(20);

    let newdevice = {
        HomeId: homeId,
        deviceId: null,
        Name: name,
        GPS: null,
        MAC: mac,
        Password: password,
        IsActive: true,
        DeviceType: type,
        FirmwareSeries: series
    };
    // Save IA Device in the database
    IADevice.create(newdevice).then(addeddevice => {
        console.log('added device', addeddevice);
        //send password to waited device:
        addeddevice.SendPasswordToDevice();

        //add to activity
        let activity = {
            event: "install-device",
            HomeId: homeId, //req.signedCookies['homeId'],
            DeviceId : addeddevice._id,
            DeviceEncId : addeddevice._encid,
            isDevice : true
        };

        //add activity
        activity.__receivetime = Date.now();
        IAActivity.create(activity).then(addedactivity => {
            //ok
        }).catch(err => {
            console.error(err)
        });

        let devicenotdetected = false;
        if(!global.current.clients[hashMac]){
            devicenotdetected = true
        }
        if(res) {
            res.send('new device added successfully!' + devicenotdetected ? ' Device is not detected now, please turn it on to complete install process.' : '');
        }
    }).catch(err => {
        console.error(err);
        if(res) {
            res.status(500).send({
                message: err.message || "Some error occurred while adding new device."
            });
        }
    });
}

exports.createDevice = createDevice;

// Create and Save a new IA Device
exports.create = async (req, res) => {
    let mac = req.body.mac;
    let name = req.body.name;
    let type = req.body.type;
    let series = req.body.series;
    let homeId = req.signedCookies['homeId'];

    await createDevice(homeId, name, type, mac, res, series);
};

// Retrieve and return all IA Devices from the database.
exports.findAll = (req, res) => {
    let filter = {};
    if(req.query.noRemoved){
        filter = {Removed: false};
    }
    IADevice.find(filter, {Password:0}).populate({
        path : 'HomeId',
        select: 'Name',
        populate : {
            path : 'CustomerId',
            select: 'FirstName LastName Username'
        }
    }).sort('HomeId DeviceType Name')
        .then(iadevices => {
            res.json(iadevices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred on retrieving devices."
        });
    });
};

// Retrieve and return all IA Devices in a smart home.
exports.findHomeDevices = (req, res) => {
    let _homeId = req.params.homeId || req.signedCookies['homeId'];
    IADevice.find({HomeId: _homeId, Removed: false})
        .then(iadevices => {
            res.json(iadevices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred on retrieving devices of the home."
        });
    });
};


exports.findSharedDevicesWithHome = (req, res) => {
    let _homeId = /*req.params.homeId ||*/ req.signedCookies['homeId'];
    IADevice.find({HomeId: {$ne:_homeId}, Removed: false, 'Share.Tokens': {$exists: true} }).select("-Password -MAC")//todo how to hide -id -_encid -_id
        .then(iadevices => {
            console.log(iadevices)
            res.json(iadevices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred on retrieving shared devices by the home."
        });
    });
};

// Retrieve and return all IA Devices in a vendor.
exports.findVendorDevices = (req, res) => {
    let _deviceTypeId = req.params.deviceTypeId;
    let _vendorId = JSON.parse( req.signedCookies['vendors'])[0]._id;//in db query for better security
    IADeviceType.findOne({VendorId: _vendorId, _id: _deviceTypeId}).then(devtype=>{
        IADevice.find(
            {DeviceType: devtype.DeviceType, Removed: false}, //todo add a field for allowing from customer
            {Password:0, MAC: 0})
            .populate({
                path : 'HomeId',
                select: 'Name',
                populate : {
                    path : 'CustomerId',
                    select: 'FirstName LastName'
                }
            })
            .then(iadevices => {
                res.json(iadevices);
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some errors occurred on retrieving devices of the home."
            });
        });
    })
};

// Find a single IA Device with a deviceId
exports.findOne = (req, res) => {
    IADevice.findById(req.params.deviceId)
        .then(iadevice => {
            if (!iadevice) {
                return res.status(404).send({
                    message: "Device not found with id " + req.params.deviceId
                });
            }
            res.send(iadevice);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Device not found with id " + req.params.deviceId
            });
        }
        return res.status(500).send({
            message: "Error retrieving a device with id " + req.params.deviceId
        });
    });
};

// Update a IA Device identified by the deviceId in the request
exports.update = (req, res) => {

    /*return res.status(500).send({
        message: "Update device not supported " //to do some changes have to be possible
    });*/

    // Validate Request TODO


    // Find IA Device and update it with the request body
    let update = {};
    if(req.body.newname) update.Name= req.body.newname;
    if(req.body.shareby) update.Share= {
        Tokens: parseInt(req.body.shareby),
        GPS: {
            lat: parseFloat(req.body.gps.lat),
            long: parseFloat(req.body.gps.long)
        },
        EnabledAt: new Date()
    };
    if(req.body.unshare) update.Share= {
        DisabledAt: new Date()
    };
    IADevice.findByIdAndUpdate(req.params.deviceId, update, {new: false})
        .then(iadevice => {
            if (!iadevice) {
                return res.status(404).send({
                    message: "Device not found with id " + req.params.deviceId
                });
            }
            res.json({success: true, message: "OK device renamed"});
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Device not found with id " + req.params.deviceId
            });
        }
        return res.status(500).send({
            message: "Error updating device with id " + req.params.deviceId
        });
    });
};

// Delete a IA Device with the specified deviceId in the request
exports.delete = (req, res) => {//todo change to findandArchive


    /*IADevice.findByIdAndRemove(req.params.deviceId)
        .then(iadevice => {*/

    IADevice.findById(req.params.deviceId)
        .then(iadevice => {
            if (!iadevice) {
                return res.status(404).send({
                    message: "Device not found with id " + req.params.deviceId
                });
            }
            // console.log(iadevice)
            // console.log(global.current.clients[iadevice._encid])
            //global.current.clients[iadevice._encid].close();
            iadevice.DeviceDelete();

            iadevice._MAC = iadevice.MAC;
            iadevice.MAC = undefined;
            iadevice.Removed = true
            iadevice.RemoveTime = Date.now();

            iadevice.save();

            //add to activity
            let activity = {
                "event": "remove-device",
                HomeId: req.signedCookies['homeId'],
                DeviceId : req.params.deviceId,
                DeviceEncId : iadevice._encid,
                isDevice : true
            };

            //add activity
            activity.__receivetime = Date.now();
            IAActivity.create(activity).then(addedactivity => {
                //ok
            }).catch(err => {
                console.error(err)
            });

            res.send({message: "Device deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Device not found with id " + req.params.deviceId
            });
        }
        return res.status(500).send({
            message: "Could not delete device with id " + req.params.deviceId
        });
    });
};

exports.firmwareupdate = (req, res) => {//todo change to findandArchive

    IADevice.findById(req.params.deviceId)
        .populate("_DeviceType")
        .then(iadevice => {
            if (!iadevice) {
                return res.status(404).send({
                    message: "Device not found with id " + req.params.deviceId
                });
            }

            ///check last firmware version according device version and last available version by device.DeviceType
            // let firmurl = `${configs.domainUrl}/firmwares/${iadevice._DeviceType._id}-${iadevice._DeviceType.OTA.Version}.bin`;//todo add -Version
            let durl = configs.domainUrl;//.replace("https","http") + ":50500";
            let fingerprint = configs.fingerprint;

            function getLastDevVersion(){
                let device = iadevice;
                let ota = iadevice._DeviceType.OTA;
                if(device.FirmwareSeries) {
                    let releases = ota.Releases.filter(function (r){return r.Series === device.FirmwareSeries}).sort(function (a,b){return b.Version-a.Version});
                    return  releases[0].Version;
                } else {
                    let releases = ota.Releases.filter(function (r){return !r.Series}).sort(function (a,b){return b.Version-a.Version});
                    return  releases[0].Version;
                }
            }

            let firmversion = getLastDevVersion();
            iadevice
            let filename = iadevice._DeviceType._id
            if(iadevice.FirmwareSeries && iadevice.FirmwareSeries > 0)
                filename += '-' + iadevice.FirmwareSeries;
            filename += '-' + firmversion;
            filename += '.bin';
            let firmurl = `${durl}/firmwares/${filename}`;

            iadevice.SendFirmwareUpdate(firmurl, fingerprint, firmversion);

            iadevice.FirmwareVersion = firmversion;
            iadevice.FirmwareUpdateTime = Date.now();

            iadevice.save();

            //add to activity
            /*let activity = {
                event: "firmware-update",
                version: firmversion,
                HomeId: req.signedCookies['homeId'],
                DeviceId : req.params.deviceId,
                DeviceEncId : iadevice._encid,
                isDevice : true
            };

            //add activity
            activity.__receivetime = Date.now();
            IAActivity.create(activity).then(addedactivity => {
                //ok
            }).catch(err => {
                console.error(err)
            });*/
            res.send({message: "Update firmware command sent to device."});
        }).catch(err => {
            console.error(err);
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Device not found with id " + req.params.deviceId
                });
            }
            return res.status(500).send({
                message: "Could not update device with id " + req.params.deviceId
            });
    });
};
