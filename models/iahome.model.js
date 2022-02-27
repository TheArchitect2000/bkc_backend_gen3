const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IADevice = require('../models/iadevice.model');
const InstalledService = require('../models/installedservice.model');

const IAHomeSchema = mongoose.Schema(
    {
        Name: {type: String, required: true},
        CustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        IsActive: Boolean,
        Address: {
            Country: String,
            Province: String,
            City: String,
            Street: String,
            ZipCode: String,
            GPS: {
                lat: Number,
                lng: Number
            }
        },
        Guard: Boolean,
        Type: String,
        Timezone: String
    },
    {
        timestamps: true
    }
);

IAHomeSchema.virtual('_devices').get(function () {
    return IADevice.find({HomeId: this._id.toString(), Removed: false} , { Password: 0});
});

IAHomeSchema.virtual('_installedServices').get(function () {
    return InstalledService.find({HomeId: this._id.toString()});
});

module.exports = mongoose.model('IAHome', IAHomeSchema);
