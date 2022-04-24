const mongoose = require('mongoose');
// const IACustomer = require('../models/iacustomer.model');
// const InstalledService = require('../models/installedservice.model');

const IAServiceSchema = mongoose.Schema(
    {
        /**
         * unique name of the service,
         * it may be unique globally or in geography or concepts scopes
         */
        Name: {type: String, required: true, index: true, unique: true},
        /**
         * a description about the service and its functionality
         * the devices used in this service
         * and how a user could pay to or earn by this service
         */
        Description: {type: String, required: false},
        /**
         * The identifier of developer created and published this service
         * this identifier must be between identifiers that before registered themself in customers
         */
        DeveloperId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        /**
         * the identifier of vendor if this service developed and owned by a vendor
         */
        VendorId: {type: mongoose.Schema.Types.ObjectId, ref: 'IAVendor', required: false, index: true},
        /**
         * icon for this service in the base64 format
         */
        Icon: String,
        /**
         * equal true if icon has padding in view, for transparent background icons
         */
        Iconpadding: Boolean,
        /**
         * list of definitions for variables exist in the service
         * a key value pair by name of variable paired to its type i.g. NUMBER, STRING, DATE, TIME, BOOLEAN
         * {
         *     "var1": "NUMBER",
         *     "var2": "STRING"
         * }
         */
        Vars: Object,
        /**
         * array of definitions of devices playing roles in this service
         */
        Devices: [{
            Name: String, // a reference to the device in the service scope
            DeviceType: String, //type of device, (refer to BKC Device Types)
            Invoker: Boolean, //does this device invokes this service?
            Receiver: Boolean, //does this device receives command from this service?
            TransferTo: Boolean, //does this device receive BKC if it is bind to a shared device of another home?
        }], //devices definitions,
        /**
         * array of buttons in service card which run a function in the code ,
         * by format like [{"title":"Do it now!", "function":"foo1"}]
         */
        Buttons: Object,
        /**
         * accesses to devices and home properties
         * ["HOME.NAME", "HOME.DEVICES.LIST", "HOME.ALERTS", "NOTIFICATION"]
         */
        NeedAccesses: Object,
        /**
         * Category of service including Automation, Lighting, Entertainment, Security or Other
         */
        Category: String,
        /**
         * not used
         */
        Compatibility: String,
        /**
         * a text containing Copyright statements
         */
        Copyright: String,
        /**
         * price of this service for installation and for each run
         * by format {Add:20, Run:0}
         */
        Price: {type:Object, default: {Add: 0, Run: 0}},
        /**
         * true means user must set a schedule for running this service,
         */
        Cron: {type: Boolean, default: false},
        // Published: {type: Boolean, default: false},
        /**
         * if true this service designed by Blockly console otherwise by Code Console
         */
        RapidMode: {type: Boolean, default: false},
        /**
         * the code to will be run after invoking the service,
         * in javascript syntax
         */
        Code: String,
        /**
         * the xml source of blockly blocks in this service
         */
        BlocklyXML: String,
        /**
         * object contains information about publication of this service in service store
         */
        Publish: {
            CurrentVersion: {type:Number, default:0}, // Version number iterator starts from 1

            PublishedVersion: {type:Number, default:0}, // Last or current Published Version, if null means service not published at current time

            PublishTime: Date, // the time of accepting and publishing of this service

            SubmittedVersion: Number, // the last version submitted for review, automatically set for Stable releases, for beta after submit, after survey result it would be deleted
            /**
             * the array of all releases of this service
             */
            Releases: [{
                //no need to beta versions now
                ReleaseType: {type: String, enum: ['Beta', 'Stable'], default: 'Stable'},
                //version of this version
                Version: Number,
                //if true means this release is the published version of the service
                OnPublish: {type: Boolean, default: false},
                //time of releasing this release
                ReleaseTime: Date,
                //which user releases this service and release
                ReleaseUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                //snapshot whole of service object
                Snapshot: Object,
                //first checking
                CheckingTime: Date,

                // SubmitTime: Date,//for beta releases
                // SubmitUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},//for beta releases

                //the user identifier which cancels publishing this service release
                CancelUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                //time of cancellation of this release
                CancelTime: Date,
                //the result of survey of this release
                SurveyResult: {type: String, enum: ['Published', 'Rejected', 'Pending', 'Checking', 'Requested'], default: 'Requested'},
                //which user is sets the survey result
                SurveyUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                //time of saving survey result
                SurveyTime: Date,
                //the user set this release as a published service in service store, may be equal to SurveyUserId
                PublishUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                //the time of publishing this release
                PublishTime: Date,
                //the user unpublish this release, equal to the userid who publishes the next version of this service
                UnPublishUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer'},
                UnPublishTime: Date,
                //version of new release going to be published and caused this version unpublished
                UnPublishToVersion: Number,
            }]
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

/*IAServiceSchema.virtual('_Installed').get(function () {
    let cc= InstalledService.count({ServiceId: this._id.toString()});
    return cc.exec().then(z=>z);
});

IAServiceSchema.virtual('_Stars').get(function () {
    return 2;
});*/

IAServiceSchema.methods.getDeveloper = function () {
    // const IACustomer = require('../models/iacustomer.model');
    // return IACustomer.findOne({_id: this.DeveloperId.toString()} , { developer: 1});
    return mongoose.model('IACustomer').findOne({_id: this.DeveloperId.toString()} , { developer: 1 });
};

IAServiceSchema.methods.InstalledCount = function () {
    // return InstalledService.count({ServiceId: this._id.toString()});
    return mongoose.model('InstalledService').count({ServiceId: this._id.toString()});
};


module.exports = mongoose.model('IAService', IAServiceSchema);
