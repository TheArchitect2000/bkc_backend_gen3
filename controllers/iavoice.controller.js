const IAVoice = require('../models/iavoice.model');
const IADevice = require('../models/iadevice.model');

//temporary for login
const tempiavoiceUsers = {};
/*

// Create and Save a new IA Voice
exports.create = (req, res) => {
    // Validate request
    /!*if(!req.body.content) {
        return res.status(400).send({
            message: "IA Voice content can not be empty"
        });
    }*!/

    // Create a IAVoice
    const iavoice = new IAVoice(req.body);

    // Save IA Voice in the database
    iavoice.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the IA Voice."
        });
    });
};

// Retrieve and return all IA Voices from the database.
exports.findAll = (req, res) => {
    IAVoice.find()
        .then(iavoices => {
            res.json(iavoices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving IA Voices."
        });
    });
};

// Find a single IA Voice with a voiceId
exports.findOne = (req, res) => {
    IAVoice.findById(req.params.voiceId)
        .then(iavoice => {
            if(!iavoice) {
                return res.status(404).send({
                    message: "IA Voice not found with id " + req.params.voiceId
                });
            }
            res.send(iavoice);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "IA Voice not found with id " + req.params.voiceId
            });
        }
        return res.status(500).send({
            message: "Error retrieving IA Voice with id " + req.params.voiceId
        });
    });
};

// Update a IA Voice identified by the voiceId in the request
exports.update = (req, res) => {
    // Validate Request TODO
    if(!req.body.content) {
        return res.status(400).send({
            message: "IA Voice content can not be empty"
        });
    }

    // Find IA Voice and update it with the request body
    IAVoice.findByIdAndUpdate(req.params.voiceId, {
        title: req.body.title || "Untitled IA Voice",
        content: req.body.content
    }, {new: true})
        .then(iavoice => {
            if(!iavoice) {
                return res.status(404).send({
                    message: "IA Voice not found with id " + req.params.voiceId
                });
            }
            res.send(iavoice);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "IA Voice not found with id " + req.params.voiceId
            });
        }
        return res.status(500).send({
            message: "Error updating IA Voice with id " + req.params.voiceId
        });
    });
};

// Delete a IA Voice with the specified voiceId in the request
exports.delete = (req, res) => {
    IAVoice.findByIdAndRemove(req.params.voiceId)
        .then(iavoice => {
            if(!iavoice) {
                return res.status(404).send({
                    message: "IA Voice not found with id " + req.params.voiceId
                });
            }
            res.send({message: "IA Voice deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "IA Voice not found with id " + req.params.voiceId
            });
        }
        return res.status(500).send({
            message: "Could not delete IA Voice with id " + req.params.voiceId
        });
    });
};*/

//when login by voice from jovo
exports.whoisme = (req, res, next) => {
    //todo need logs and activities
    //TODO check req.ip is for localhost

    if(req.body.check){
        IAVoice.findOne({JovoUserId: req.body.jovouserid, Platform: req.body.platform})
            .then(iavoice => {
                if(iavoice)
                    res.json({valid: true});
                else
                    res.json({valid: false});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some errors occurred while retrieving Voices."
            });
        });
    } else {
        for(let k in tempiavoiceUsers) {
            if(tempiavoiceUsers[k].password === req.body.password){
                (tempiavoiceUsers[k])['jovouserid'] = req.body.jovouserid;
                // Create an IAVoice
                const iavoice = new IAVoice({
                    HomeId: tempiavoiceUsers[k].homeId,
                    CustomerId: tempiavoiceUsers[k].customerId,
                    Password: tempiavoiceUsers[k].password,
                    JovoUserId: tempiavoiceUsers[k].jovouserid,
                    Platform: req.body.platform
                });

                // Save IA Voice in the database
                iavoice.save()
                    .then(data => {
                        res.json(tempiavoiceUsers[k]);
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Voice."
                    });
                });
                return;
            }
        }
        //if user not found
        res.status(404).json({
            valid: false,
            message: 'not found'
        });
    }
};

//all device action from jovo to broker
exports.deviceaction = (req, res, next) => {
    //todo need logs and activities
    let iabroker = require('../IAbroker');
    //TODO check req.ip is for localhost
    let jovouserid = req.body.jovouserid;
    let homeId = req.body.homeId;
    let customerId = req.body.customerId;
    // actions such as turn on turn off play stop ...
    let action = req.body.action;
    let device = req.body.device;//it is device name said by user
    let commandPayload = {};
    let command = '', needstate = '';
    switch(action) {
        case 'TURN_ON':
            command = 'TURN_ON';
            needstate = 'ON';
            break;
        case 'TURN_OFF':
            command = 'TURN_OFF';
            needstate = 'OFF';
            break;
        case 'PLAY':
            command = 'PLAY';
            needstate = 'PLAYING';
            break;
        case 'PAUSE':
            command = 'PAUSE';
            needstate = 'PAUSED';
            break;
        case 'LAST_STATE':
            command = null;
            needstate = null;
            break;
        case 'DEVICES_LIST':
            command = null;
            needstate = null;
            break;
        default:
            command = '';
    }



    //find previous login
    IAVoice.findOne({HomeId: homeId, JovoUserId: jovouserid}).then(iavoicerecord => {
        if(!iavoicerecord){
            res.status(401).send('Unauthorized connection!');
        } else {
            if(device) {
                //find device in home
                IADevice.findOne({HomeId: homeId, Removed: false, Name: new RegExp('^' + device + '$', "i")})
                    .then(iadevice => {
                        if (!iadevice) {
                            res.status(404).send({
                                done: false,
                                message: 'there is no device named "' + device + '"'
                            });
                        } else {
                            let encdeviceid = IADevice.encryptid(iadevice._doc._id.toString());

                            if (command) {
                                commandPayload.command = command;
                                commandPayload = JSON.stringify(commandPayload);
                                let message = {
                                    topic: encdeviceid,
                                    payload: commandPayload,
                                    qos: 1,
                                    retain: false // or true
                                };
                                iabroker.publish(message, function () {
                                    setTimeout(() => {
                                        res.status(200).json({
                                            done: true,
                                            lastState: global.lastState[encdeviceid],
                                            message: 'Done'
                                        });
                                    }, 2000); //wait for lastState change
                                });
                            } else {
                                if (action === 'LAST_STATE') {
                                    res.status(200).json({
                                        done: true,
                                        lastState: global.lastState[encdeviceid] || 'undefined',
                                        message: 'Responded'
                                    });
                                }
                            }

                        }
                    }).catch(err => {
                    res.status(500).send({
                        done: false,
                        message: err.message || "Some errors occurred while retrieving Devices in home."
                    });
                });
            } else {
                IADevice.find({HomeId: homeId, Removed: false}, "_id Name DeviceType _encid _online")
                    .then(iadevices => {
                        if (iadevices.length === 0) {
                            res.status(404).send({
                                done: false,
                                message: 'no device exists in the home'
                            });
                        } else {
                            if (action === 'DEVICES_LIST') {
                                res.status(200).json({
                                    done: true,
                                    devices: iadevices,
                                    message: 'Responded'
                                });
                            } else {
                                res.json({
                                    done: false,
                                    message:'no response'
                                })
                            }
                        }
                    }).catch(err => {
                    res.status(500).send({
                        done: false,
                        message: err.message || "Some errors occurred while retrieving devices of smart home."
                    });
                });
            }
        }
        // todo cache data here

    } ).catch(err => {
        res.status(401).send('Unauthorized connection!!');
    });
};

//panel get a password to show to user for next iavoice login
exports.getiavpassword = (req, res, next) => {
    let homeId = req.signedCookies['homeId'];
    if(typeof homeId === 'undefined'){
        res.status(500).send('not true user');
        return;
    }

    function gfg() {
        var minm = 1000;
        var maxm = 9999;
        return (Math.floor(Math.random() * (maxm - minm + 1)) + minm) + '';
    }
    let currentiavUser = tempiavoiceUsers[homeId];
    if(!currentiavUser){
        currentiavUser = {
            valid: true,
            homeId: homeId,
            customerId: req.signedCookies['customer']._id,
            FirstName: req.signedCookies['customer'].FirstName,
            password : gfg(),
        };
        tempiavoiceUsers[homeId] = currentiavUser;
    }
    //delete this secret after 1 minute
    setTimeout(()=>{
        let currentiavUser = tempiavoiceUsers[homeId];
        if(currentiavUser){
            if(currentiavUser.registered) { //means the password has been said by a user of panel via jovo

            } else { //expire and delete unused password
                delete tempiavoiceUsers[homeId];
            }
        }
    }, 60000);
    res.send(currentiavUser.password+'')
};

exports.getprelogins = (req, res) => {
    IAVoice.find({HomeId: req.signedCookies['homeId']})
        .then(iavoices => {
            res.json(iavoices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving voices."
        });
    });
};

exports.disconnect = (req, res) => {
    //todo need logs and activities
    IAVoice.findByIdAndRemove(req.params.iavoiceId)
        .then(iavoice => {
            if(!iavoice) {
                return res.status(404).send({
                    message: "Voice not found with id "
                });
            }
            res.send({message: "Disconnected from platform successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Voice not found with id "
            });
        }
        return res.status(500).send({
            message: "Could not delete Voice with id "
        });
    });
};
