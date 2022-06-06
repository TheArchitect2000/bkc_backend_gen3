const mongoose = require('mongoose');

const BKCResolutionBonusSchema = mongoose.Schema(
    {
        "Expired": Boolean,
        "StartDate": Date,
        "EndDate": Date,
        "ScheduleExpression": String,
        "CurrentsPerHour": Number,
        "ButteryPerHour": Number,
        "StateX": Number,
        "CurrentX": Number,
        "ButteryX": Number,
        "BonusSourceCustomerId": mongoose.Schema.Types.ObjectId
    },
    {
        timestamps: true
    }
);


BKCResolutionBonusSchema.statics.getActiveResolution = function (){
    return BKCResolutionBonusModel.findOne({Expired: false})
}

BKCResolutionBonusSchema.statics.initialize = function (){
    return BKCResolutionBonusModel.countDocuments({},(err, count)=>{
        if(count === 0) {
            BKCResolutionBonusModel.create(
                {
                    "Expired": false,
                    "ResolutionId" : 100,
                    "StartDate": "",
                    "EndDate": "",
                    "ScheduleExpression": "30 02 * * *",
                    "CurrentsPerHour": 720,
                    "ButteryPerHour": 60,
                    "StateX": 1,
                    "CurrentX": 1,
                    "ButteryX": 1,
                    "BonusSourceCustomerId": null
                }
            ).then(resolution => {
                console.log("First BKCResolutionBonus created");
                return "First BKCResolutionBonus created";
            }).catch(err => {
                console.error("First BKCResolutionBonus could not generated");
                return "First BKCResolutionBonus could not generated";
            });
        } else {
            console.log("BKCResolutionBonus has "+count+" records");
            return "BKCResolutionBonus has "+count+" records";
        }
    })
}

const BKCResolutionBonusModel = mongoose.model('BKCResolutionBonus', BKCResolutionBonusSchema);


module.exports = BKCResolutionBonusModel;
