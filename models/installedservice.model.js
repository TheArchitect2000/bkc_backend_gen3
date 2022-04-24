const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstalledServiceSchema = mongoose.Schema(
    {
        ServiceId: {type: Schema.Types.ObjectId, ref: 'IAService', required: true, index: true},
        ServiceVersion: {type: Number, index: true, required: false },//if null it is installed from root of service but installed from that version release
        HomeId: {type: Schema.Types.ObjectId, ref: 'IAHome', required: true, index: true},
        Activated: Boolean,//this installed service is activated or not
        ServiceSnapshot: Object, // a Snapshot of service when installing it if ServiceVersion is null todo this field must be removed
        Vars: Object, //any variable value
        Devices: Object, //devices Ids
        Cron: String
    },
    {
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    }
);

/*InstalledServiceSchema.virtual('_ServiceSnapshot', {
    ref: 'IAService', // The model to use
    localField: 'ServiceId', // Find service where `localField`
    foreignField: 'ServiceId', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true,
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});*/

//this virtual needs .find({})populate("ServiceId")
InstalledServiceSchema.virtual('_ServiceSnapshot').get(function () {
    if(this.ServiceId instanceof mongoose.Types.ObjectId)
        return null;
    if(this.ServiceVersion !== undefined){
        if(this.ServiceVersion === 0){//direct install without release version
            return this.ServiceId;
        } else { //installed by release version
            return this.ServiceId.Publish.Releases.find(release=>release.Version===this.ServiceVersion).Snapshot;
        }
    } else {
        return this.ServiceSnapshot
    }
    //return IADevice.find({HomeId: this._id.toString(), Removed: false} , { Password: 0});
});

module.exports = mongoose.model('InstalledService', InstalledServiceSchema);