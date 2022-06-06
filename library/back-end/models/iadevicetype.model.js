const mongoose = require('mongoose');
// const IADevice = require('../models/iadevice.model');
// const IACustomer = require('../models/iacustomer.model');

const IADeviceTypeSchema = mongoose.Schema(
    {
        DeviceType: {type: String, required: true, index: true, unique: true},//code of devicetype
        DeviceName: {type: String, required: true},//name of device type
        Type: {type: String, enum: ["SENSOR", "ACTUATOR"]},
        Description: {type: String, required: false},//text description
        DeveloperId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true, alias: "Developer"}, //one who developed this service
        VendorId: {type: mongoose.Schema.Types.ObjectId, ref: 'IAVendor', required: false, index: true}, //if service owned by a vendor
        Icon: String,// base64 icon
        Iconpadding: Boolean, //is icon have padding in view, for transparent background icons
        Data: [{
            Name: String,//for example state, current, state2
            Type: {type: String, enum: ["String", "Number"]},
            Enum: [String],
            iconclass: String,
            Unit: String,
            isOption: Boolean
        }],
        Commands: [{
            Command: String,
            Title: String,
            State: String
        }],
        CommandType: {type: String, enum: ["switch", "button", "radio", "switch", "check", "voice"]},
        Controllers:[{}],
        Price: {type:Object, default: {Add: 0, Run: 0}},// like {InstallPrice:20,RunPrice:0}
        Published: {type: Boolean, default: false},
        publishedAt: Date, //Date of published this version, version number is VersionNo
        VersionNo: {type: Number, default: 0},
        Active: {type: Boolean, default: true},
        Blockly: {
            Blocks: String,
            JavaScript: String
        },
        OTA: {
            Version: Number,
            Series: Number,
            Time: Date,
            Releases: [{
                Version: Number,
                Series: Number,
                Time: Date,
                CustomerId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                OriginalFileName: String,
                Size: Number
            }]
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

/*IADeviceTypeSchema.virtual('_Installed').get(function () {
    let cc= InstalledService.count({ServiceId: this._id.toString()});
    return cc.exec().then(z=>z);
});

IADeviceTypeSchema.virtual('_Stars').get(function () {
    return 2;
});*/

IADeviceTypeSchema.methods.getDeveloper = function () {
    return mongoose.model('IACustomer').findOne({_id: this.DeveloperId.toString()} , { developer: 1});
};

IADeviceTypeSchema.methods.getVendor = function () {
    return mongoose.model('IAVendor').findOne({_id: this.VendorId.toString()} /*todo, { developer: 1}*/);
};

IADeviceTypeSchema.methods.InstalledCount = function () {
    return mongoose.model('IADevice').count({DeviceType: this.DeviceType, Removed: {$ne: true}});
};


module.exports = mongoose.model('IADeviceType', IADeviceTypeSchema);