const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IAHome = require('../models/iahome.model');
const IADevice = require('../models/iadevice.model');


const IAActivitySchema = mongoose.Schema(
    {
        DEVICE_STATUS: {type: String, index: true},
        state: {type: String, index: true},
        battery: {type: String, index: true},
        DeviceEncId: {type: String, index: true},
        DeviceId: {type: Schema.Types.ObjectId, ref: 'IADevice', index: true},
        HomeId: {type: Schema.Types.ObjectId, ref: 'IAHome', index: true},
        // CustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', index: true},
    },
    {
        strict: false, //to can save fields not in schema
        strictQuery: false,
        timestamps: true,
        versionKey: false, //without __v
        // autoIndex: false
    }
);

IAActivitySchema.index({createdAt:1});

/*IAActivitySchema.virtual('_homes').get(function () {
    return IAHome.find({CustomerId: this._id.toString()});
});*/

module.exports = mongoose.model('IAActivity', IAActivitySchema);