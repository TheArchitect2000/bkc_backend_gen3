const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VendorMemberRoles = {
    ADMIN: 1,
    SUPERVISOR: 1,

    SERVICE_DEVELOPER: 1, //can Add service , modify and delete if not published
    SERVICE_PUBLISHER: 1, //can publish, unpublish or delete

    DEVICE_DEVELOPER: 1,  //can add new device type
    DEVICE_PUBLISHER: 1,  //can publish or unpublish device type

    VENDOR_SETTING: 1,
    USER_SETTING:1
};
const IADeviceType = require('../models/iadevicetype.model');
const IAService = require('../models/iaservice.model');

const IAVendorSchema = mongoose.Schema(
    {
        Name: {type: String, required: true},
        CustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        Owner: String,
        Type: String,
        Timezone: String,
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
        Members: [
            {
                CustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true, unique: true},
                Roles: {type:[String], enum: Object.keys(VendorMemberRoles), required: true},
                updatedAt: Date
            }
        ]
    },
    {
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    }
);

IAVendorSchema.virtual('_devicetypes').get(async function () {
    let dts = await IADeviceType.find({VendorId: this._id.toString()});
    return dts;
});

IAVendorSchema.virtual('_services').get(async function () {
    return await IAService.find({VendorId: this._id.toString()});
});

IAVendorSchema.methods.getVendor = function (req) {
    this.Members.map((Member)=>{
        if(Member.CustomerId._id.toString() === req.signedCookies['customer']._id){
            Member._doc.You = true;
        }
    })
    return this;
};

module.exports = mongoose.model('IAVendor', IAVendorSchema);