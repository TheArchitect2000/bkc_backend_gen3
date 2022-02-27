const IAActivity = require('../models/iaactivity.model');
const IADevice = require('../models/iadevice.model');
// const IADeviceType = require('../models/iadevicetype.model');
const IABTt = require('../models/iabt_transfer.model');
// const BonusSourceCustomerId = require('../config/which.config').BonusSourceCustomerId;
const BonusRuntime = require('../config/which.config').BonusRuntime;
const BonusRuntimezone = require('../config/which.config').BonusRuntimezone;
// cron
const cron = require('node-cron');
const mongoose = require('mongoose');
// const resolutions = require('../config/BKC_Resolutions.json');
// let resolution = resolutions.find(r=>r.Expired===false);
// let currentsPerHour = 3600/5; // 720
// let butteryPerHour = 3600/60; //60
// let StateX, ButteryX, CurrentX = 1;

const awardBonusTokens = async (req, res) => {
    // console.error('***************************',mongoose.Types.ObjectId(BonusSourceCustomerId),'*****************')
    let resolution = await require('../models/bkc.resolution.bonus.model').getActiveResolution();
    /** return rows like:
     {
  "_id": {
    "DeviceId": "5ff072443a1e9040e151e01c",
    "day": 7,
    "month": 5,
    "year": 2021
  },
  "count": 1,
  "c_hasState": 0,
  "c_hasCurrent": 0,
  "c_hasBattery": 0,
  "dev": [
    {
      "_id": "5ff072443a1e9040e151e01c",
      "Removed": true,
      "HomeId": "5f7f34771d5d4f5255e06b41",
      "Name": "Home 2 home",
      "GPS": null,
      "Password": "MoKysL^oKb&Qvqbz59ro",
      "IsActive": true,
      "DeviceType": "POWER_PLUG",
      "createdAt": "2021-01-02T13:16:52.093Z",
      "updatedAt": "2021-05-07T13:53:29.171Z",
      "__v": 0,
      "RemoveTime": "2021-05-07T13:53:29.163Z",
      "_MAC": "FC:F5:C4:A6:1F:7B"
    }
  ],
  "home": [
    {
      "_id": "5f7f34771d5d4f5255e06b41",
      "Address": {
        "GPS": {
          "lat": null,
          "lng": null
        },
        "Country": "Iran",
        "Province": "",
        "City": "ساختمان وسط نما اجر سه سانت ط۲ واحد۴",
        "Street": "میدان ازادگان شهرک اما رضا بلوار معلم خیابان معلم هفتم فرعی دوم بن بست اول",
        "ZipCode": "3179769881"
      },
      "CustomerId": "5f7f33c31d5d4f5255e06ace",
      "Name": "Moh3en",
      "Type": "HOME",
      "IsActive": true,
      "Guard": false,
      "createdAt": "2020-10-08T15:47:03.812Z",
      "updatedAt": "2020-10-08T15:47:03.812Z",
      "__v": 0
    }
  ]
},
     {
  "_id": {
    "DeviceId": "605b29cf74fc0454be8ff73c",
    "day": 7,
    "month": 5,
    "year": 2021
  },
  "count": 250,
  "c_hasState": 2,
  "c_hasCurrent": 246,
  "c_hasBattery": 0,
  "dev": [
    {
      "_id": "605b29cf74fc0454be8ff73c",
      "Removed": false,
      "HomeId": "5f159d08283547212d880015",
      "Name": "power miz",
      "GPS": null,
      "MAC": "FC:F5:C4:A5:CD:15",
      "Password": "dB4JrU5KKtgqT&wSmjYt",
      "IsActive": true,
      "DeviceType": "POWER_PLUG",
      "createdAt": "2021-03-24T12:00:15.130Z",
      "updatedAt": "2021-04-19T09:18:23.837Z",
      "__v": 0,
      "FirmwareUpdateTime": "2021-04-19T09:18:23.829Z",
      "FirmwareVersion": 7
    }
  ],
  "home": [
    {
      "_id": "5f159d08283547212d880015",
      "Address": {
        "Country": null,
        "Province": null,
        "City": null,
        "Street": null,
        "ZipCode": null,
        "GPS": {
          "lat": null,
          "lng": null
        }
      },
      "CustomerId": "5f159c5e283547212d880013",
      "Name": "Mehdi@devcopa",
      "Type": "HOME",
      "IsActive": true,
      "Guard": true,
      "createdAt": "2020-07-20T13:32:56.562Z",
      "updatedAt": "2021-04-12T05:49:05.558Z",
      "__v": 0,
      "Timezone": "Asia/Tehran"
    }
  ]
},
     {
  "_id": {
    "DeviceId": "605ef2f174fc0454be909b9b",
    "day": 7,
    "month": 5,
    "year": 2021
  },
  "count": 12700,
  "c_hasState": 11,
  "c_hasCurrent": 12677,
  "c_hasBattery": 0,
  "dev": [
    {
      "_id": "605ef2f174fc0454be909b9b",
      "Removed": false,
      "HomeId": "5f547917b7b46232f4452536",
      "Name": "New Plug 1",
      "GPS": null,
      "MAC": "FC:F5:C4:A5:09:F4",
      "Password": "A^sVCCfV3tAUvrv5gt8Z",
      "IsActive": true,
      "DeviceType": "POWER_PLUG",
      "createdAt": "2021-03-27T08:55:13.339Z",
      "updatedAt": "2021-04-20T03:29:43.488Z",
      "__v": 0,
      "FirmwareUpdateTime": "2021-04-20T03:29:43.484Z",
      "FirmwareVersion": 7
    }
  ],
  "home": [
    {
      "_id": "5f547917b7b46232f4452536",
      "Address": {
        "GPS": {
          "lat": null,
          "lng": null
        },
        "Country": "Iran",
        "Province": "Tehran",
        "City": "Tehran",
        "Street": "No 8, Sardar Jangal, Poonak",
        "ZipCode": "1915132345"
      },
      "CustomerId": "5f547727b7b46232f44520ef",
      "Name": "My Home",
      "Type": "HOME",
      "IsActive": true,
      "Guard": false,
      "createdAt": "2020-09-06T05:52:23.224Z",
      "updatedAt": "2020-09-13T05:57:25.326Z",
      "__v": 0
    }
  ]
}
     */
    IAActivity.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setDate(new Date().getDate() - 2)),
                    // $lte: new Date(new Date().setDate(new Date().getDate() - days))
                },
                isDevice: true
            }
        },
        {
            $addFields: {
                "_year": {
                    "$year": "$createdAt"
                },
                "_month": {
                    "$month": "$createdAt"
                },
                "_day": {
                    "$dayOfMonth": "$createdAt"
                }
            }
        },
        {
            $match: {
                "_year": new Date((new Date()).setDate(new Date().getDate() - 1)).getFullYear(),//checked for first day of a year
                "_month": new Date((new Date()).setDate(new Date().getDate() - 1)).getMonth() + 1, //because January starts with 0
                "_day": new Date().getDate() - 1,
            }
        },
        {
            $addFields: {
                // _hour: {$hour: {$toDate:"$__receivetime"}},
                _hasState: { $cond: [{ $not: ["$state"] }, 0, 1] },
                _hasBattery: { $cond: [{ $not: ["$battery"] }, 0, 1] },
                _hasCurrent: { $cond: [{ $not: ["$current"] }, 0, 1] }

            }
        },
        {
            $group: {
                _id: { DeviceId: "$DeviceId", day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                count: { $sum: 1 },
                c_hasState: { $sum: "$_hasState" },
                c_hasCurrent: { $sum: "$_hasCurrent" },
                c_hasBattery: { $sum: "$_hasBattery" },
                // stdDev: { $stdDevPop: "$_hour" }
            }
        },
        {
            $sort: {"_id.DeviceId":1, "_id.year": -1, "_id.month": -1, "_id.day": -1 }
        },
        {
            $lookup: {
                from: "iadevices",
                localField: "_id.DeviceId",
                foreignField: "_id",
                as: "dev"
            }
        },
        {
            $lookup: {
                from: "iahomes",
                localField: "dev.HomeId",
                foreignField: "_id",
                as: "home"
            }
        }
    ]
    ).then(async rows => {
        console.log('awardBonusTokens query rows ', rows.length);
        for(let row of rows){
            if(row.home.length > 0) {
                let bonus = resolution.StateX * row.c_hasState + resolution.CurrentX * Math.ceil(row.c_hasCurrent/ resolution.CurrentsPerHour) + resolution.ButteryX * Math.ceil(row.c_hasBattery/ resolution.ButteryPerHour);
                let tResult = await IABTt.transfer(new mongoose.Types.ObjectId(resolution.BonusSourceCustomerId), row.home[0].CustomerId, bonus, IABTt.TransferCases().BONUS_FOR_PAYLOAD, `BONUS TOKENS TO DEVICE "${row.dev[0].Name}" ON "${row._id.year} ${row._id.month} ${row._id.day}" `, null, resolution._id);
                row.transfer = tResult.TransferOK;
            }
        }
        // res.send('DONE FOR YESTERDAY')
        if(res)
            res.json(rows);
    }).catch(err => {
        if(res)
            res.status(500).send({
                message: err.message || "Some errors occurred while award bonus."
            });
        console.error('bonus cron error', err.message, err);
    });
};


setTimeout( async function () {
//schedule if BonusRuntime has value
    if (BonusRuntime) {
        //initializing
        console.log('---------------------------------------')
        await require('../models/bkc.resolution.bonus.model').initialize().then(function (){

        }).catch(function (err){})
        //run schedule
        try {
            let runtime = BonusRuntime;
            let task = cron.schedule(runtime, (fireDate) => {
                console.log('running a awardBonusTokens at ' + fireDate);
                awardBonusTokens()
            }, {
                scheduled: true,
                timezone: BonusRuntimezone
            });
            console.log('add cron for awardBonusTokens at ' + runtime)
        } catch (e) {
            console.error('Error on cron', e)
        }
    }
}, 5000);

// Create and Save a new IA Customer
/*exports.create = (req, res) => {
    // Validate request
    /!*if(!req.body.content) {
        return res.status(400).send({
            message: "IA Customer content can not be empty"
        });
    }*!/

    // Create a IACustomer
    const iacustomer = new IACustomer(req.body);

    // Save IA Customer in the database
    iacustomer.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the IA Customer."
        });
    });
};*/

// Retrieve and return all IA Customers from the database.

exports.findHomeActivities = async (req, res) => {
    let pagecount = 500;
    let pageNumber;
    // var ObjectId = require('mongoose').Types.ObjectId;
    let onlydevId = req.query.onlydev;
    let devs;
    try {
        if(onlydevId)
            devs = await IADevice.find({_id: onlydevId} , {});//in IADevices all devices even them Removed is true
        else
            devs = await IADevice.find({HomeId: req.signedCookies['homeId']} , {});//in IADevices all devices even them Removed is true
    } catch (err){
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Customers."
        });
        return;
    }

    let devices = [];
    let records = req.params.records;
    if(!records) records = 0;
    records = parseInt(records);
    let exists = req.query.exists;
    if(!exists) exists = false;
    if(req.query.count)
        pagecount = parseInt(req.query.count);
    if(req.query.pageNumber)
        pageNumber = parseInt(req.query.pageNumber);

    for(let d of devs){
        devices.push(require('mongoose').Types.ObjectId(d._id));
    }
    let criteria = {
        current: {$exists: false}, //todo handle for other current like fields
        event: {$exists: false}, //exclude events like connect or disconnect
        // updatedAt: {$gte: new Date(new Date().setDate(new Date().getDate()-(days+7))), $lte:new Date(new Date().setDate(new Date().getDate()-days))},
        $or: [{homeId: req.signedCookies['homeId']},
            {isDevice: true, DeviceId: {$in: devices}}]
    };
    if(exists) {
        for(let existfield in exists){
            criteria[existfield] = { $exists: true };
        }
    }

    if(onlydevId)
        criteria = {
            DeviceId: {$in: devices},
            isDevice: true,
            event: {$exists: false},
            command: {$exists: false},
            DEVICE_STATUS: {$exists: false},
        };

    /*IAActivity.find(criteria).then(activities => {
        for(let ac of activities){
            if(ac._doc.isDevice) {
                let dev = devs.filter((d) => d._doc._id.toString() === ac._doc.DeviceId.toString())[0];
                ac._doc.device = {
                    Name: dev._doc.Name,
                    DeviceType: dev._doc.DeviceType,
                    Removed: dev._doc.Removed
                }
            }
        }
        res.json(activities);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving IA Customers."
        });
    });*/


    let callback = (err, activities) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some errors occurred while retrieving Customers."
            });
        } else {
            if(!onlydevId)
                for (let ac of activities) {
                    if (ac._doc.isDevice) {
                        let dev = devs.filter((d) => d._doc._id.toString() === ac._doc.DeviceId.toString())[0];
                        ac._doc.device = {
                            Name: dev._doc.Name,
                            DeviceType: dev._doc.DeviceType,
                            Removed: dev._doc.Removed
                        }
                    }
                }
            res.json(activities);
        }
    };
    if(pageNumber){
        IAActivity.find(criteria, callback)
            .sort( { _id: -1 } )
            .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * pagecount ) : 0 )
            .limit( pagecount );
    } else {
        IAActivity.find(criteria, callback).sort({updatedAt: -1}).skip(records).limit(pagecount);
    }
};

exports.findHomeSEN = async (req, res) => {
    // var ObjectId = require('mongoose').Types.ObjectId;
    let devs = await IADevice.find({HomeId: req.signedCookies['homeId'], Removed: false} , {});//in IADevices all devices even them Removed is true
    let devices = [];
    let days = req.query.days;
    if(days){
        days = parseInt(days);
    } else {
        days = 0;
    }
    let aggregated = req.query.aggregated;
    let category = req.query.category || 'DAILY';
    //fields which represent current of power
    let currentfields = req.query.currentfields;
    if(!currentfields) currentfields = ['current'];

    for(let d of devs){
        // let devtype = await IADeviceType.findOne({DeviceType:d.DeviceType} , {});
        // if(devtype.data["current"])
        if((d.DeviceType === 'POWER_PLUG')||(d.DeviceType === 'COOLING_TOWER'))
            devices.push(require('mongoose').Types.ObjectId(d._id));
    }
    let criteria = {
        createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - (days + 30))),
            // $lte: new Date(new Date().setDate(new Date().getDate() - days))
        },
        isDevice: true,
        DeviceId: {$in: devices}
    };

    if(days > 0){
        criteria.updatedAt = {
            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
        }
    }

    if(currentfields.length===1) {
        criteria[currentfields[0]] = { $exists: true };
    } else if(currentfields.length > 1) {
        let currents_or_criteria = [];
        for (let cfield of currentfields) {
            currents_or_criteria.push({[cfield]: {$exists: true}}) ;
        }
        criteria['$or']  = currents_or_criteria;
    }

    //let groupby = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
    let groupby = {};
    if(category === 'DAILY'){
        groupby = { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } , weekday: {$dayOfWeek: "$createdAt"}};
    } else if(category === 'MONTHLY'){
        groupby = { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
    } else if(category === 'YEARLY'){
        groupby = { year: { $year: "$createdAt" } };
    } else if(category === 'WEEKLY'){
        groupby = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
    }
    if(!aggregated || aggregated === 'false') {
        groupby['deviceId'] = "$DeviceId";
    }

    let addFields = {
        __current : {$toDouble: "$current"}
    };
    let group = {
        _id: groupby,
        sumCurrent: { $sum: "$__current" },
        avgCurrent: { $avg: "$__current" },
        count: { $sum: 1 }
    };
    /*let lookup = {
        from: "iadevices",
        localField: "DeviceId",
        foreignField: "_Id",
        as: "device"
    };*/
    IAActivity.aggregate([
        {$addFields: addFields},
        {$match: criteria},
        {$group: group},
        {$sort: {"_id.year":-1, "_id.month": -1, "_id.day": -1}}
        /*,
        {$lookup: lookup}*/
    ]).then(activities => {
        /*for(let ac of activities){
            if(ac._doc.isDevice) {
                let dev = devs.filter((d) => d._doc._id.toString() === ac._doc.DeviceId.toString())[0];
                ac._doc.device = {
                    Name: dev._doc.Name,
                    DeviceType: dev._doc.DeviceType,
                    Removed: dev._doc.Removed
                }
            }
        }*/
        res.json(activities);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred while retrieving Customers."
        });
        console.error(err.message, err)
    });
};

exports.awardBonusTokens = awardBonusTokens;

// Find a single IA Customer with a customerId
/*exports.findOne = (req, res) => {
    IACustomer.findById(req.params.customerId)
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "IA Customer not found with id " + req.params.customerId
                });
            }
            res.send(iacustomer);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "IA Customer not found with id " + req.params.customerId
            });
        }
        return res.status(500).send({
            message: "Error retrieving IA Customer with id " + req.params.customerId
        });
    });
};*/

// Update a IA Customer identified by the customerId in the request
/*exports.update = (req, res) => {
    let newcustomer = req.body;
    let newCustomerInfo = {
        FirstName : newcustomer.FirstName,
        LastName : newcustomer.LastName,
        // Email : newcustomer.Email,
        Mobile: newcustomer.Mobile,
        developer: {
            Title: newcustomer.DeveloperTitle
        }
    };

    // Find IA Customer of cookie and update it with the request body
    IACustomer.findByIdAndUpdate(req.signedCookies['customer']._id,
        { $set: newCustomerInfo }
        , {new: true, upsert: false})
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "IA Customer not found with id "
                });
            }
            let _customer = {
                FirstName: iacustomer.FirstName,
                LastName: iacustomer.LastName,
                developer: iacustomer.developer,
                Mobile: iacustomer.Mobile/!* ? '*****'+customer.Mobile.substr(5) : ''*!/,
                Email: /!*iacustomer.Email ||*!/ iacustomer.Username/!* ? '*****'+customer.Email.substr(5) : ''*!/
            };
            const maxAgeCookie = 3600000 * 24 * 7; // would expire after 7 days
            res.cookie('customerb', JSON.stringify(_customer), {
                maxAge: maxAgeCookie,
                httpOnly: false, // if true The cookie only accessible by the web server
                signed: false // Indicates if the cookie should be signed
            });
            res.json({message: "OK"});
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "IA Customer not found with id "
            });
        }
        return res.status(500).send({
            message: "Error updating IA Customer with id "
        });
    });
};*/

// Delete a IA Customer with the specified customerId in the request
/*
exports.delete = (req, res) => {
    IACustomer.findByIdAndRemove(req.params.customerId)
        .then(iacustomer => {
            if(!iacustomer) {
                return res.status(404).send({
                    message: "IA Customer not found with id " + req.params.customerId
                });
            }
            res.send({message: "IA Customer deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "IA Customer not found with id " + req.params.customerId
            });
        }
        return res.status(500).send({
            message: "Could not delete IA Customer with id " + req.params.customerId
        });
    });
};*/
