const IAService = require('../models/iaservice.model');
const IAServiceComment = require('../models/iaservicecomment.model');

// Create and Save a new IA Service
exports.create = (req, res) => {
    // Create a IAService
    let newservice = req.body;
    //todo check service for security prevent injection Publish field

    newservice.Price = {Add: 0, Run: 0};
    newservice.NeedAccesses = [];
    newservice.DeveloperId = req.signedCookies['customer']._id;



    // Save IA Service in the database
    IAService.create(newservice).then(addedservice => {
        res.send("Service Added Successfully");
    }).catch(err => {
        let message = err.message;
        if(err.code === 11000){
            message = 'Name "'+ newservice.Name+'" is already assigned to another service. Please choose another name.'
        }
        res.status(500).send({
            message: message || "Some error occurred while creating the BKC service."
        });
    });
};

// Retrieve services for this developerid or login user
exports.findDeveloperServices = (req, res) => {
    let _developerId = req.params.developerId || req.signedCookies['customer']._id;//todo add security
    IAService.find({DeveloperId: _developerId, VendorId:{$exists: false}})
        .then(async iaservices => {
            await prepareServices(iaservices);
            res.json(iaservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving services for this developer."
        });
    });
};

// Retrieve services for this vendorid or login user
exports.findVendorServices = (req, res) => {
    let _vendorId = req.params.vendorId || req.signedCookies['vendors'][0]._id;//todo add security
    IAService.find({VendorId: _vendorId})
        .then(async iaservices => {
            await prepareServices(iaservices);
            res.json(iaservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving services for this developer."
        });
    });
};

// Retrieve services which are published to service gallery
exports.findPublishedServices = (req, res) => {
    // let _developerId = req.params.developerId || req.signedCookies['customer']._id;

    //!important : just with 'Publish.Releases.OnPublish':true in conditions and 'Publish.Releases.$':1 in projection we can fetch just one item in Releases array otherwise all releases returned
    IAService.find({'Publish.PublishedVersion': {$gt:0}, 'Publish.Releases.OnPublish':true},
        {'Publish.Releases.$':1, DeveloperId:1, 'Publish.PublishedVersion':1})
    .then(async iaservices => {
            await prepareServicesGallery(iaservices);
            res.json(iaservices);
        }).catch(err => {
            console.error(err);
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving services for this developer."
        });
    });
};

// Retrieve service new releases to publish
exports.findNewReleases = (req, res) => {
    IAService.find({Publish:{$exists:true}, 'Publish.SubmittedVersion':{$gt:0}})//.$where('this.Publish.CurrentVersion>this.Publish.PublishedVersion')
        .then(async iaservices => {
            await prepareServices(iaservices);
            res.json(iaservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving services for this developer."
        });
    });
};

// Retrieve and return all IA Services from the database.
async function prepareServices(iaservices) {
    for (let ias of iaservices) {
        let _i = await ias.InstalledCount();
        let _dev = await ias.getDeveloper();
        ias._doc._Developer = _dev.developer?_dev.developer.Title:'';
        ias._doc._Installed = _i;
        ias._doc._Stars = _i < 1 ? 0 : _i < 5 ? 1 : _i < 10 ? 2 : _i < 20 ? 3 : _i < 50 ? 4 : 5;
    }
}

// Retrieve and return all IA Services from the database.
async function prepareServicesGallery(iaservices) {
    let services = [];
    for (let ias of iaservices) {

        let _i = await ias.InstalledCount();
        let _dev = await ias.getDeveloper();
        ias._doc._Developer = _dev.developer?_dev.developer.Title:'';
        ias._doc._Installed = _i;
        ias._doc._Stars = _i < 1 ? 0 : _i < 5 ? 1 : _i < 10 ? 2 : _i < 20 ? 3 : _i < 50 ? 4 : 5;

        let service = ias._doc;
        Object.assign(service, service.Publish);
        delete service.Publish;
        Object.assign(service, service.Releases[0].Snapshot);
        let release = service.Releases[0]._doc;
        delete release.Snapshot;
        delete release._id;
        Object.assign(service, release);
        delete service.Releases;
    }
}

exports.findAll = (req, res) => {
    IAService.find()
        .then(async iaservices => {
            await prepareServices(iaservices);
            res.json(iaservices);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving services."
        });
    });
};

// Find a single IA Service with a serviceId
exports.findOne = (req, res) => {

    IAService.findById(req.params.serviceId,{  'Publish.Releases.Snapshot': 0, 'Publish.Releases.SurveyUserId': 0, 'Publish.Releases.PublishUserId': 0, 'Publish.Releases.UnPublishUserId': 0  })
        .then(async iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC Service not found with id " + req.params.serviceId
                });
            }

            await prepareServices([iaservice]);
            res.send(iaservice);

        }).catch(err => {
        console.error('find one service ', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "BKC service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Error retrieving BKC service with id " + req.params.serviceId
        });
    });
};

// Update a IA Service identified by the serviceId in the request
exports.update = (req, res) => {
    // Validate Request TODO
    /*if(!req.body.content) {
     return res.status(400).send({
     message: "IA Service content can not be empty"
     });
     }*/

    let newservice = req.body;
    if(!newservice.Vars) newservice.Vars = [];
    if(!newservice.Devices) newservice.Devices = [];
    if(!newservice.Buttons) newservice.Buttons = [];
    if(!newservice.Price) newservice.Buttons = {Add:0,Run:0};

    //todo check service for security prevent injection Publish field


    // Find IA Service and update it with the request body
    IAService.findByIdAndUpdate(req.params.serviceId,
        newservice,
        {new: false})
        .then(iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }
            //res.send(iaservice);
            return res.status(200).send({
                message: "BKC service is updated"
            });
        }).catch(err => {
            let message = err.message;
            if(err.code === 11000){
                message = 'Name "'+ newservice.Name+'" is already assigned to another service. Please choose another name or cancel changes.'
            }
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "BKC service not found with id "
                });
            }
            return res.status(500).send({
                message: message
            });
        });
};


//push new release in Publish
exports.addRelease = async (req, res) => {
    IAService.findById(req.params.serviceId)
        .then(iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }

            if(iaservice.Publish.SubmittedVersion){
                return res.status(405).send({
                    message: "If you already have requested a release to review, you could not add another release until you wait for it's review result, or you cancel it"
                });
            }

            let newVersion = iaservice.Publish.CurrentVersion + 1;
            let newTime = new Date();
            let Snapshot = JSON.parse(JSON.stringify(iaservice));
            delete Snapshot.Publish;

            iaservice.Publish.CurrentVersion = newVersion;
            //todo set Submitted Version automatically but later for beta release it must be not automatically
            iaservice.Publish.SubmittedVersion = newVersion;

            iaservice.Publish.Releases.push({
                // ReleaseType: 'Stable' or 'Beta', //todo
                Version: newVersion,
                ReleaseTime: newTime,
                ReleaseUserId: req.signedCookies['customer']._id,
                Snapshot: Snapshot
            });

            iaservice.save();

            return res.status(200).send({
                message: "BKC service release added"
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "BKC service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Error updating publish BKC service with id " + req.params.serviceId + " "+err.message
        });
    });

    /*IAService.findOneAndUpdate(
        {
            _id: req.params.serviceId,
        },
        {
            "Publish.Version" : req.body['Version'],
            "Publish.Time": new Date(),
            $push: {
                "Publish.Releases" : {
                    Version : req.body['Version'],
                    Time: new Date(),
                    Size: file.size,
                    OriginalFileName: file.originalname,
                    CustomerId: req.signedCookies['customer']._id
                }
            }
        },
        function (error, success) {
            if (error) {
                res.json({saved: false, success: false, message: 'Could not update firmware version'});
                console.log(error);
            } else {
                res.json({saved: true, success: true, message: 'Firmware updated'});
                console.log(success);
            }
        }
    )*/
};

//remove a release by version
exports.deleteRelease = async (req, res) => {
    IAService.findById(req.params.serviceId)
        .then(iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }

            let _release = iaservice.Publish.Releases.find(release => release._id.toString() === req.params.releaseId);

            /// detect to unpublish instead delete
            if (_release.OnPublish) {
                _release.UnPublishTime = new Date();
                _release.UnPublishUserId = req.signedCookies['customer']._id;
                _release.UnPublishToVersion = _release.Version;
                _release.OnPublish = false;

                iaservice.Publish.PublishedVersion = 0;

                iaservice.save();

                return res.status(200).send({
                    message: "BKC service release unpublished"
                });
            }


            if (_release.SurveyResult !== 'Requested') {
                return res.status(405).send({
                    message: "This release could not be deleted , because it passed survey steps"
                });
            }

            //delete iaservice.Publish.SubmittedVersion if this version is going to be deleted
            if(iaservice.Publish.SubmittedVersion === _release.Version)
                iaservice.Publish.SubmittedVersion = 0;

            //remove release from Publish.Releases
            _release.remove();

            iaservice.save();

            return res.status(200).send({
                message: "BKC service release deleted"
            });
        }).catch(err => {
            console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "BKC service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Error deleting BKC service with id " + req.params.serviceId + " "+err.message
        });
    });
};

//set survey result for a release by version
exports.surveyRelease = async (req, res) => {
    IAService.findById(req.params.serviceId)
        .then(iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }

            let _release = iaservice.Publish.Releases.find(release => release._id.toString() === req.params.releaseId);

            let currenttime = new Date();
            let currentUserId = req.signedCookies['customer']._id;


            if(!_release.CheckingTime) CheckingTime = currenttime;

            _release.SurveyResult = req.body.SurveyResult;
            _release.SurveyTime = currenttime;
            _release.SurveyUserId = currentUserId;


            //set iaservice.Publish.SubmittedVersion to 0 if this version has a final survey
            if(iaservice.Publish.SubmittedVersion === _release.Version){
                if(['Rejected','Published'].includes(_release.SurveyResult))
                    iaservice.Publish.SubmittedVersion = 0;
            }

            //if Published
            if(_release.SurveyResult === 'Published'){
                //check pre published version
                if(iaservice.Publish.PublishedVersion>0){
                    let prePublishedRelease = iaservice.Publish.Releases.find(release => release.Version === iaservice.Publish.PublishedVersion)
                    prePublishedRelease.UnPublishTime = currenttime;
                    prePublishedRelease.UnPublishUserId = currentUserId;
                    prePublishedRelease.UnPublishToVersion = _release.Version;
                    prePublishedRelease.OnPublish = false;
                }

                iaservice.Publish.PublishedVersion = _release.Version;
                iaservice.Publish.PublishTime = currenttime;

                _release.PublishTime = currenttime;
                _release.PublishUserId = currentUserId;
                _release.OnPublish = true;
            }


            iaservice.save();

            return res.status(200).send({
                message: "BKC service release deleted"
            });
        }).catch(err => {
            console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "BKC service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Error deleting BKC service with id " + req.params.serviceId + " "+err.message
        });
    });
};

// Delete a BKC Service with the specified serviceId in the request
exports.delete = (req, res) => {
    IAService.findById(req.params.serviceId)
        .then(async iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }
            let installedCount = await iaservice.InstalledCount();
            if(installedCount===0) {
                //remove service from collection
                iaservice.remove();
                return res.send({message: "BKC service deleted successfully!"});
            } else {
                return res.status(401).send({
                    message: "You can not delete this service because it is installed " + installedCount + " time(s)."
                });
            }
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "BKC service not found with id " + req.params.serviceId
            });
        }
        return res.status(500).send({
            message: "Could not delete BKC service with id " + req.params.serviceId
        });
    });
};

// Retrieve comments of service
exports.getComments = (req, res) => {
    // let _user = req.signedCookies['customer']._id;
    IAServiceComment.find({ParentId: req.params.serviceId, ParentSchema: 'S'})
        .then(comments => {
            res.json(comments);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Service comments."
        });
    });
};

// Retrieve Icon of service
exports.getIcon = (req, res) => {
    IAService.findById(req.params.serviceId)
        .then(iaservice => {
            if (!iaservice) {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }

            if(iaservice.Icon === ''){
                res.status(404).send({message:"BKC service have not image"});
            } else {
                var img = Buffer.from(iaservice.Icon.split(",")[1], 'base64');
                res.writeHead(200, {
                    'Cache-Control': 'private, max-age=3600000',
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });

                res.end(img);
            }

        }).catch(err => {
            console.error('find one service ', err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "BKC service not found with id " + req.params.serviceId
                });
            }
            return res.status(500).send({
                message: "Error retrieving BKC service with id " + req.params.serviceId
            });
        });
};

exports.addComment = (req, res) => {
    let newcomment = {
        Text: req.body.Text,
        User: req.signedCookies['customer']._id,
        ParentId: req.params.serviceId,
        ParentSchema: 'S'
    }
    IAServiceComment.create(newcomment).then(addedcomment => {
        res.send("Comment Added Successfully");
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while creating the BKC service Comment."
        });
    });
};
