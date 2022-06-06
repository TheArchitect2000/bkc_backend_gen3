const mongoose = require('mongoose');
const IAFileServer = require('../models/iafileserver');
const fs = require('fs');
var path = require('path');
const mime_db = require('./mime-db.json');

// Create and Save a new File
exports.create = (req, res) => {
    let file = req.files['audio-file'];
    file = file[0];
    // Create a IAFileServer

    //find biggest Order in folder
    IAFileServer.find({
        Folder: req.body['folder'],
        CustomerId: req.signedCookies['customer']._id
    }).sort({ Order: -1 }).limit(1).then(afile => {
        let newOrder = 0;
        if(afile.length > 0){
            newOrder = (afile[0].Order) ? (afile[0].Order + 1) : 1;
        }

        let extention = file.originalname.split('.').reverse()[0];
        let extensions = mime_db[file.mimetype].extensions;
        if(extensions && !extensions.includes(extention)){
            extention = extensions[0];
        }
        const iafile = new IAFileServer(
            {
                FileName: file.filename,
                Size: file.size,
                Duration: req.body['file-duration'],
                MimeType: file.mimetype,
                OriginalFileName: req.body['file-name'] || file.originalname,
                FileExtention: extention,
                Folder: req.body['folder'],
                Order: newOrder,
                CustomerId: req.signedCookies['customer']._id
            }
        );

        // Save File in the database
        iafile.save()
            .then(data => {
                res.json({message: 'OK', saved: true});
            }).catch(err => {
            //todo delete file which saved but dont saved in db
            console.error(err);
            res.status(500).send({
                saved: false,
                message: err.message || "Some error occurred while creating the File."
            });
        });
    });
};

// Create and Save a new Playlist
exports.createPlaylist = (req, res) => {

    // Create a playlist in IAFileServer
    const iafile = new IAFileServer(
        {
            FileName: req.body.Name,
            OriginalFileName: req.body.Name,
            Folder: "playlist",//todo maybe is incorrect
            CustomerId: req.signedCookies['customer']._id,
            isPlaylist: true
        }
    );

    // Save File in the database
    iafile.save()
        .then(data => {
            res.json({message: 'OK', saved: true, _id: data._id});
        }).catch(err => {
            //todo delete file which saved but dont saved in db
            console.error(err);
            res.status(500).send({
                saved: false,
                message: err.message || "Some error occurred while creating the File."
            });
        });
};

// Create and Save a new File
exports.createfirmware = (req, res) => {
    let file = req.files['firm-file'];/// || req.files['record-file'];
    file = file[0];

    //update iadevicetype record
    mongoose.model('IADeviceType').findOneAndUpdate(
        {
            _id: req.body['DeviceTypeId'],
        },
        {
            "OTA.Version" : req.body['Version'],
            "OTA.Series" : req.body['Series'],
            "OTA.Time": new Date(),
            $push: {
                "OTA.Releases" : {
                    Version : req.body['Version'],
                    Series : req.body['Series'],
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
    )
};

// Retrieve and return all Files from the database.
exports.findAllCustomerFiles = (req, res) => {
    //todo add mime filter req.params.mime
    let filter = {};
    if(req.params.userspace==='customer') {
        filter.CustomerId = req.signedCookies['customer']._id;
        filter.Folder = req.params.folder;
    } else if(req.params.userspace==='ia') {
        filter.Folder = 'ia/'+req.params.folder;
    }

    IAFileServer.find(filter).sort({'Order': 1,'createdAt': -1})
        .then(files => {
            res.json(files);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Files."
        });
    });
};

// Find a single File with a fileId
exports.findOne = (req, res) => {
    IAFileServer.findById(req.params.fileId)
        .then(iafile => {
            if(!iafile) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send(iafile);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "File not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            message: "Error retrieving File with id " + req.params.fileId
        });
    });
};

// Find last File of playlist by pl_id
exports.PlayLastOfPlaylist = (req, res) => {
    IAFileServer.findOne({Folder : req.params.pl_id}).sort({'Order': -1})
        .then(iafile => {
            if(!iafile) {
                return res.status(404).send({
                    message: "File not found in last of playlist by id " + req.params.pl_id
                });
            }
            res.redirect('/fileserver/'+iafile.FileName);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "File not found in last of playlist by id " + req.params.pl_id
            });
        }
        return res.status(500).send({
            message: "Error retrieving File in last of playlist with id " + req.params.pl_id
        });
    });
};

// Update a playlist identified by the fileId in the request
exports.updatePlaylist = async (req, res) => {
    // Find playlist and update it with the request body
    if(req.body.New_Name){
        IAFileServer.updateOne({_id:req.body.PL_id, CustomerId: req.signedCookies['customer']._id}, {
            OriginalFileName: req.body.New_Name,
            FileName: req.body.New_Name
        }, {new: true})
            .then(iafile => {
                if(!iafile) {
                    return res.status(404).send({
                        message: "Playlist not found with id " + req.body.PL_id
                    });
                }
                res.send(iafile);
            }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.body.PL_id
                });
            }
            return res.status(500).send({
                message: "Error updating File with id " + req.params.fileId
            });
        });
    }
    if(req.body.New_Order){
        try {
            let NewOrder = parseInt(req.body.New_Order);
            let PreOrder = parseInt(req.body.Pre_Order);

            //without bulk
            await IAFileServer.find({
                Folder: req.body.PL_id,
                Order: PreOrder,
                CustomerId: req.signedCookies['customer']._id
            }).update({$set:{Order: -1}});
            if (NewOrder > PreOrder) {//all files between preorder and neworder order--
                await IAFileServer.updateMany({
                    Folder: req.body.PL_id,
                    CustomerId: req.signedCookies['customer']._id,
                    Order: {$gt: req.body.Pre_Order, $lte: req.body.New_Order}
                }, { $inc: { Order: -1 } });
            } else {
                await IAFileServer.updateMany({
                    Folder: req.body.PL_id,
                    CustomerId: req.signedCookies['customer']._id,
                    Order: {$gte: req.body.New_Order, $lt: req.body.Pre_Order}
                }, { $inc: { Order: 1 } })
            }
            await IAFileServer.find({
                Folder: req.body.PL_id,
                Order: -1,
                CustomerId: req.signedCookies['customer']._id
            }).update({Order: NewOrder});
            return res.send({
                message: "OK", success: true
            });
            //with bulk
            /*let bulk = IAFileServer.collection.initializeOrderedBulkOp();
            bulk.find({
                Folder: req.body.PL_id,
                Order: PreOrder,
                CustomerId: req.signedCookies['customer']._id
            }).update({$set:{Order: 1000}});
            if (NewOrder > PreOrder) {//all files between preorder and neworder order--
                bulk.find({
                    Folder: req.body.PL_id,
                    CustomerId: req.signedCookies['customer']._id,
                    Order: {$gt: req.body.Pre_Order, $lte: req.body.New_Order}
                }).update({$inc: {Order: -1}});
            } else {
                bulk.find({
                    Folder: req.body.PL_id,
                    CustomerId: req.signedCookies['customer']._id,
                    Order: {$gte: req.body.Pre_Order, $lt: req.body.New_Order}
                }).update({$inc: {Order: +1}});
            }
            bulk.find({
                Folder: req.body.PL_id,
                Order: -1,
                CustomerId: req.signedCookies['customer']._id
            }).update({Order: NewOrder});

            bulk.execute(function (err,result) {
                return res.send({
                    message: "OK", success: true
                });
            })*/

        } catch (e) {
            return res.status(404).send({
                success: false, message: "Playlist not found with id " + req.body.PL_id
            });
        }
    }
};

// Delete a File with the specified fileId in the request
exports.delete = (req, res) => {
    IAFileServer.findOneAndDelete({_id:req.params.fileId, CustomerId: req.signedCookies['customer']._id})
        .then(deletedfile => {
            if(!deletedfile) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send({message: "File deleted successfully!"});
            //delete physical file
            IAFileServer.findOne({FileName:req.params.fileName, CustomerId: req.signedCookies['customer']._id})
                .then(similarfiles => {
                    if (!similarfiles) {
                        fs.unlink(path.join(__dirname, '../../../resources/fileserver/' + req.params.fileName), function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });
                    }
                });
            IAFileServer.updateMany({
                Folder: deletedfile.Folder,
                Order: {$gt: deletedfile.Order},
                CustomerId: req.signedCookies['customer']._id
            }, { $inc: { Order: -1 } }).then(resultx=>{
                console.log('File deleted shift order!');
            })
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "File not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            message: "Could not delete File with id " + req.params.fileId
        });
    });
};

// Delete a playlist with the specified _id in the request
exports.deletePlaylist = (req, res) => {
    IAFileServer.deleteOne({_id:req.body.PL_id, CustomerId: req.signedCookies['customer']._id})
        .then(iafile => {
            if(!iafile) {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.params.fileId
                });
            }
            res.send({message: "Playlist deleted successfully!"});
            //delete physical file
            if(req.body.PL_delete_files === "true") {
                IAFileServer.find({CustomerId: req.signedCookies['customer']._id, Folder: req.body.PL_id})
                    .then(files => {
                        for(let file of files){
                            IAFileServer.findOne({FileName:file.FileName, CustomerId: req.signedCookies['customer']._id})
                                .then(iafile => {
                                    if (!iafile) {
                                        fs.unlink(path.join(__dirname, '../../../resources/fileserver/' + file.FileName), function (err) {
                                            if (err) throw err;
                                            // if no error, file has been deleted successfully
                                            file.remove();
                                            console.log('File deleted!', file.FileName);
                                        });
                                    }
                                })
                        }
                    }).catch(err => {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Files when delete 1."
                    });
                });
            } else {
                IAFileServer.update({CustomerId: req.signedCookies['customer']._id, Folder: req.body.PL_id}, {$set: {Folder: 'files'}}, {multi: true})
                    .then(files => {

                    }).catch(err => {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while retrieving Files when delete 2."
                    });
                });
            }
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "playlist not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            message: "Could not delete playlist with id " + req.params.fileId
        });
    });
};

// copy a File into playlist
exports.copyToPlaylist = (req, res) => {
    // Find File and update it with the request body
    if(req.body.move === 'true') {
        //find current file's Folder and Order
        IAFileServer.findOne({_id: req.body.file_id}).then(thisfile=>{
            IAFileServer.updateMany({
                Folder: thisfile.Folder,
                Order: {$gt: thisfile.Order},
                CustomerId: req.signedCookies['customer']._id
            }, { $inc: { Order: -1 } }).then(resultx=>{
                //find biggest Order in second folder
                IAFileServer.find({
                    Folder: req.body.PL_id,
                    CustomerId: req.signedCookies['customer']._id
                }).sort({ Order: -1 }).limit(1).then(afile => {
                    let newOrder = 0;
                    if (afile.length > 0) {
                        newOrder = afile[0].Order + 1;
                    }
                    IAFileServer.updateOne({_id: req.body.file_id, CustomerId: req.signedCookies['customer']._id}, {
                        Folder: req.body.PL_id,
                        Order: newOrder
                    }, {new: true})
                        .then(iafile => {
                            if (!iafile) {//todo check result , it is response of how many affected
                                return res.status(404).send({
                                    message: "Playlist not found with id " + req.body.PL_id
                                });
                            }
                            res.send({message: "File moved successfully!"});
                        }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "Playlist not found with id " + req.body.PL_id
                            });
                        }
                        return res.status(500).send({
                            message: "Error updating File with id " + req.body.file_id
                        });
                    });
                })
            })
        });


    } else {
        //find biggest Order in second folder
        IAFileServer.find({
            Folder: req.body.PL_id,
            CustomerId: req.signedCookies['customer']._id
        }).sort({ Order: -1 }).limit(1).then(afile => {
            let newOrder = 0;
            if (afile.length > 0) {
                newOrder = afile[0].Order + 1;
            }
            IAFileServer.findById(req.body.file_id).exec(
                function (err, doc) {
                    doc._id = mongoose.Types.ObjectId();
                    doc.isNew = true; //<--------------------IMPORTANT
                    doc.Folder = req.body.PL_id;
                    doc.Order = newOrder;
                    doc.save(function () {
                        res.send({message: "File copied successfully!"});
                    });
                }
            );
        })
    }
};