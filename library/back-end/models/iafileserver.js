const mongoose = require('mongoose');

const IAFileServerSchema = mongoose.Schema(
    {
        CustomerId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        FileName: {type: String, required: true},
        OriginalFileName: {type: String, required: true},
        Folder: {type: String, required: false},
        Order: {type: Number},//order in folder started from 1
        Size: {type: Number},//bytes
        Duration: {type: Number},//seconds
        MimeType: {type: String, enum1: ['audio', 'image', 'video','document']},
        FileExtention: {type: String, enum1: ['mp3', 'wma','amr']},
        isPlaylist: {type: Boolean, default: false}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('IAFileServer', IAFileServerSchema);