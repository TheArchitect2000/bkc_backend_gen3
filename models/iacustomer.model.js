const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const IAHome = require('../models/iahome.model');
const IAVendor = require('../models/iavendor.model');


const IACustomerSchema = mongoose.Schema(
    {
        FirstName: {type: String, required: true, match: [/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i, 'Please fill a true Firstname']},
        LastName: {type: String, required: true, match: [/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i, 'Please fill a true Lastname']},
        Username: {type: String, required: true, index: true, unique: true},
        Password: {type: String, required: true},
        UserId: {type: String/*, required: false, index: true, unique: false*/},
        Mobile: {type:String, match: [/^(\+|00|0)?(\d{0,2})?[ -]?(\d{3,4})?[ -]?(\d{7})$/gm , 'Please fill a correct Mobile Number']},
        Email: {type: String, required: true, index: true, /*unique: true,*/ sparse: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
        NotifySubscription: String,//subscription in web notification
        IsActive: {type: Boolean, default: false},
        Country: String,
        City: String,
        ZipCode: String,
        HomeId: {type: Schema.Types.ObjectId, ref: 'IAHome'},
        developer: Object,
        OutWalletAddr: String
    },
    {
        timestamps: true
    }
);

IACustomerSchema.virtual('_homes').get(function () {
    return IAHome.find({CustomerId: this._id.toString()});
});

IACustomerSchema.virtual('_vendors').get(function () {
    return IAVendor.find({Members: {$elemMatch: {CustomerId: mongoose.Types.ObjectId(this._id)}}},"_id Name Owner");
});

/**
 * This is the middleware, It will be called before saving any record
 */
/*IACustomerSchema.pre('save', function(next) {

    // check if password is present and is modified.
    if ( this.password && this.isModified('password') ) {
        // call your hashPassword method here which will return the hashed password.
        this.password = IACustomerSchema.statics.hashPassword(this.password);
    }

    // everything is done, so let's call the next callback.
    next();

});*/

IACustomerSchema.statics.hashPassword = function (password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return [salt, hash].join('$');
};

// Checking the password hash
IACustomerSchema.statics.verifyHash = function (password, original) {
    const originalHash = original.split('$')[1];
    const salt = original.split('$')[0];
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

    return hash === originalHash
};

module.exports = mongoose.model('IACustomer', IACustomerSchema);
