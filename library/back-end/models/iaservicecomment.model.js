const mongoose = require('mongoose');

const IAServiceCommentSchema = mongoose.Schema(
    {
        User: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true}, //one who written this comment
        Text: String,
        ParentSchema: {type: String, required: true, index: true},//S for IAservices
        ParentId: {type:mongoose.Schema.Types.ObjectId, required: true, index: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('IAServiceComment', IAServiceCommentSchema);