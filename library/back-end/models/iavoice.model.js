const mongoose = require('mongoose');

const IAVoiceSchema = mongoose.Schema(
    {
        CustomerId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        HomeId: {type: mongoose.Schema.Types.ObjectId, ref: 'IAHome', index: true},
        JovoUserId: {type: String, required: true},
        Platform: {type: String, required: true},//Alexa, Google Assistant, Google Nest
        Password: {type: String, required: false},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('IAVoice', IAVoiceSchema);