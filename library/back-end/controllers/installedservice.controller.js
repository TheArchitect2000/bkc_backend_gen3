const InstalledService = require('../models/installedservice.model');
const IAHome = require('../models/iahome.model');
const IAService = require('../models/iaservice.model');
const IABTt = require('../models/iabt_transfer.model');
const mongoose = require('mongoose');

// Create and Save a new Installed Service
exports.create = async (req, res) => {
    // Create a InstalledService
    let newinstalledservice = req.body;
    // newinstalledservice.CustomerId = req.signedCookies['customer']._id;

    let serviceId = newinstalledservice.ServiceId;
    let serviceVersion = parseInt(newinstalledservice.ServiceVersion);
    let theService = await IAService.findById(serviceId, " -Icon -Iconpadding -Code -BlocklyXML");

    // let serviceDeveloper = await theService.getDeveloper();
    // theService._doc._Developer = serviceDeveloper.developer;

    if(serviceVersion){
        let theRelease = theService.Publish.Releases.find(release=>release.Version===serviceVersion);
        if(!theRelease){
            res.status(404).send({
                message: err.message || `Can not install service ${theService.Name} by version ${serviceVersion}`
            });
        }
        theService = theRelease.Snapshot;
    } else {
        serviceVersion = 0;
    }




    let customerId = req.signedCookies['customer']._id;
    let ninstalledservice = {
        ServiceId: serviceId,
        ServiceVersion: serviceVersion,
        // ServiceSnapshot: theService,
        CustomerId: customerId,
        HomeId: req.signedCookies['homeId'],
        Activated: true,
        Vars: newinstalledservice.Vars,
        Devices: newinstalledservice.Devices,
        Cron: newinstalledservice.Cron
    };

    let canInstall = false;

    //give Token for install service
    if(theService.Price.Add && theService.Price.Add > 0) {
        try {
            let tResult = await IABTt.transfer(customerId, theService.DeveloperId, theService.Price.Add, IABTt.TransferCases().SERVICE_INSTALL, `Install the service "${theService.Name}"`);
            canInstall = tResult.TransferOK;
        }catch (err){
            console.error(err);
            canInstall = false;
            res.status(500).send({
                message: err.TransferString || "Some error occurred while creating the Installed Service."
            });
            return;
        }
    } else {
        canInstall = true;
    }

    // Save Installed Service in the database
    if(canInstall) {
        InstalledService.create(ninstalledservice)
            .then(async addedservice => {
                //add cron services to IACrontab
                if (ninstalledservice.Cron !== "false") {
                    let Timezone = (await IAHome.findById(ninstalledservice.HomeId, "Timezone")).Timezone;
                    global.current.addCronService(ninstalledservice.Cron, addedservice._doc, Timezone);
                }

                res.send("Service Added Successfully");
            }).catch(err => {
            console.error(err.message);
            //TODO need refund tokens

            res.status(500).send({
                message: err.message || "Some error occurred while creating the Installed Service."
            });
        });
    }
};

// Retrieve and return all Installed Services from the database.
exports.findAll = (req, res) => {
    InstalledService.find()
        .then(installedservices => {
            res.json(installedservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Installed Services."
        });
    });
};

//run after open IAPlatform to add all cron installed service to global.
mongoose.connection
    .once('open', () => {

        InstalledService.find()
            .then(async (installedservices) => {
                console.log('start adding cron ia services...');
                for(installedservice of installedservices){
                    if (installedservice.Cron !== "false") {
                        try {
                            let Timezone = (await IAHome.findById(installedservice.HomeId, "Timezone")).Timezone;
                            console.log('adding cron with timezone ', Timezone,'installedservice._id',installedservice._id);
                            global.current.addCronService(installedservice.Cron, installedservice._doc, Timezone);
                        } catch (e){
                            console.error('error when adding cron ia services.','cron',installedservice.Cron ,e);
                        }
                    }
                }
                console.log('end of adding cron ia services.');
            }).catch(err => {
            console.error('error when adding cron ia services.',err);
        });
        // throw Error("Hello xxxxx")
    });




// Find a single Installed Service with a installedServiceId
exports.findOne = (req, res) => {

    let _iserviceId = req.params.installedServiceId;
    InstalledService.findById(_iserviceId)
        .then(installedservice => {
            if (!installedservice) {
                return res.status(404).send({
                    message: "Installed Service not found with id " + req.params.installedServiceId
                });
            }

            res.send(installedservice);

        }).catch(err => {
        console.error('find one InstalledService ', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Installed Service not found with id " + req.params.installedServiceId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Installed Service with id " + req.params.installedServiceId
        });
    });
};

exports.callRun = (req, res) => {

    let _iserviceId = req.params.installedServiceId;
    let _vmFunction = req.body ? req.body.vmFunction : undefined;
    InstalledService.findById(_iserviceId)
        .then(installedservice => {
            if (!installedservice) {
                return res.status(404).send({
                    message: "Installed Service not found with id " + req.params.installedServiceId
                });
            }

            run(installedservice._doc, _vmFunction);
            res.send('done')

        }).catch(err => {
        console.error('find one InstalledService ', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Installed Service not found with id " + req.params.installedServiceId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Installed Service with id " + req.params.installedServiceId
        });
    });
};

function run(installedservice, vmFunction) {
    // let iabroker = require('../IAbroker');
    let IAServiceRunner = require('../iaservice/IAService');
    IAServiceRunner.runService(installedservice,null,null,null, vmFunction);
    // console.log(installedservice)
}

// Retrieve and return all installed services in a smart home.
exports.findHomeInstalledServices = (req, res) => {
    let _homeId = req.params.homeId || req.signedCookies['homeId'];
    InstalledService.find({HomeId: _homeId})
        .populate('ServiceId', '-BlocklyXML -Code -Publish.Releases.Snapshot.BlocklyXML -Publish.Releases.Snapshot.Code')//populate required for _ServiceSnapshot virtual field
        .then(installedservices => {
            res.json(installedservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Installed Services in smart home."
        });
    });
};

// Update a Installed Service identified by the installedServiceId in the request
exports.update = (req, res) => {
    console.log('installedservice .update')
    let newservice = req.body;
    // newservice.CustomerId = req.signedCookies['customer']._id;

    let nservice = {
        Vars: newservice.Vars,
        Devices: newservice.Devices,
        Cron: newservice.Cron,
        Activated : newservice.Activated
    };

    // Find Installed Service and update it with the request body
    InstalledService.findByIdAndUpdate(req.params.installedServiceId,
        {$set: nservice },
        {new: true, upsert: false})
        .then(async installedservice => {
            if (!installedservice) {
                return res.status(404).send({
                    message: "Installed Service not found with id "// + req.params.installedServiceId
                });
            }
            //cron check
            if(installedservice.Cron !== "false"){
                global.current.removeCronService(installedservice._id);
                let Timezone = (await IAHome.findById(installedservice.HomeId , "Timezone")).Timezone;
                global.current.addCronService(installedservice.Cron,installedservice._doc, Timezone);
            }
            return res.status(200).send({
                message: "Installed Service data updated"
            });
        }).catch(err => {
            console.error(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Installed Service not found with id "// + req.params.installedServiceId
                });
            }
            return res.status(500).send({
                message: "Error updating Installed Service with id "// + req.params.installedServiceId
            });
        });
};

// Delete a Installed Service with the specified installedServiceId in the request
exports.delete = (req, res) => {
    InstalledService.findByIdAndRemove(req.params.installedServiceId)
        .then(installedservice => {
            if (!installedservice) {
                return res.status(404).send({
                    message: "Installed Service not found with id " + req.params.installedServiceId
                });
            }
            //delete schedule
            if(installedservice.Cron){
                global.current.removeCronService(req.params.installedServiceId);
            }
            res.send({message: "Installed Service deleted successfully!"});
        }).catch(err => {
            console.error(err);
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Installed Service not found with id " + req.params.installedServiceId
            });
        }
        return res.status(500).send({
            message: "Could not delete Installed Service with id " + req.params.installedServiceId
        });
    });
};
