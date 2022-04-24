const IATicket = require('../models/iaticket.model');

// Create and Save a new File
exports.createorpush = (req, res) => {
    let ticket = req.body;
    let iaticket = null;
    if(ticket.ticketid){
        // Push to Correspondence
        let update = {
            Status: 'Open',
            $push: {
                Correspondence: {
                    Text: ticket.Text,
                    sentAt: Date.now(),
                    Sender: req.signedCookies['customer']._id
                }
            }
        };
        if(ticket.Status){
            if(ticket.Status === 'Replied'){
                update.Status = ticket.Status;
            } else {
                update = {
                    Status: ticket.Status
                }
            }
        }
        IATicket.findOneAndUpdate(
            { _id: ticket.ticketid },
            update,
            function (error, success) {
                if (error) {
                    res.json({success: false, message: 'Ticket update failed!'});
                    console.log(error);
                } else {
                    res.json({success: true, message: 'Ticket Updated!'});
                    console.log(success);
                }
            }
        );
    } else {
        // Create a IATicket
        iaticket = new IATicket(
            {
                CustomerId: ticket.CustomerId || req.signedCookies['customer']._id,
                Title: ticket.Title,
                Status: 'Open',
                SubjectId: ticket.SubjectId,
                Correspondence: [
                    {
                        Text: ticket.Text,
                        sentAt: Date.now(),
                        Sender: req.signedCookies['customer']._id
                    }
                ]
            }
        );
        // Save IATicket in the database
        iaticket.save()
            .then(data => {
                res.json({message: 'OK', saved: true, newId: data._id});
            }).catch(err => {
            //todo delete file which saved but dont saved in db
            console.error(err);
            res.status(500).send({
                saved: false,
                message: err.message || "Some errors occurred while creating the ticket."
            });
        });
    }
};

// Retrieve and return all IATickets of customer from the database.
exports.findAllCustomerIATickets = (req, res) => {
    //todo add mime filter req.params.mime
    let filter = {CustomerId : req.signedCookies['customer']._id};
    /*if(req.params.userspace==='customer') {
        filter.;
    } else if(req.params.userspace==='ia') {
        filter.Folder = 'ia/'+req.params.folder;
    }*/

    IATicket.find(filter).sort({'updatedAt': -1})
        .then(tickets => {
            for(let tic of tickets){
                delete tic.CustomerId;
                for(let corr of tic.Correspondence) {
                    corr.Sender = corr.Sender === req.signedCookies['customer']._id ? 'U' : 'IA';
                }
            }
            res.json(tickets);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Tickets."
        });
    });
};

// Retrieve and return all IATickets for admin from the database.
exports.findAllIATicketsforAdmin = (req, res) => {
    //todo add mime filter req.params.mime
    let filter = {};
    /*if(req.params.userspace==='customer') {
        filter.;
    } else if(req.params.userspace==='ia') {
        filter.Folder = 'ia/'+req.params.folder;
    }*/

    // IATicket.find(filter).sort({'updatedAt': -1})
    IATicket.aggregate([
        {
            $match: filter
        },
        {
            $lookup: { from: 'iacustomers', localField: 'CustomerId', foreignField: '_id', as: 'customer' }
        }
    ])
        .then(tickets => {
            for(let tic of tickets){
                tic.customer = tic.customer[0].FirstName+' '+tic.customer[0].LastName;
                for(let corr of tic.Correspondence) {
                    corr.Sender = corr.Sender === tic.CustomerId.toString() ? 'U' : tic.CustomerId.toString();
                }
                delete tic.CustomerId;
            }
            res.json(tickets);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Tickets."
        });
    });
};

// Find a single File with a fileId
/*exports.findOne = (req, res) => {
    IATicket.findById(req.params.fileId)
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
};*/

// Update a IATicket identified by the _Id in the request
/*exports.update = (req, res) => {
    // Validate Request TODO
    /!*if(!req.body.content) {
        return res.status(400).send({
            message: "File content can not be empty"
        });
    }*!/

    // Find File and update it with the request body
    IATicket.findByIdAndUpdate(req.params.fileId, {
        title: req.body.title || "Untitled File",
        content: req.body.content
    }, {new: true})
        .then(ticket => {
            if(!ticket) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            //res.send(ticket);
            res.json({message: 'update ok', success: true})
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "File not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error updating File with id " + req.params.fileId
        });
    });
};*/

// Delete a File with the specified fileId in the request
/*
exports.delete = (req, res) => {
    IATicket.deleteOne({_id:req.params.fileId, CustomerId: req.signedCookies['customer']._id})
        .then(iafile => {
            if(!iafile) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send({message: "File deleted successfully!"});
            //delete physical file
            fs.unlink(path.join(__dirname, '../public/fileserver/'+req.params.fileName), function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
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
};*/
