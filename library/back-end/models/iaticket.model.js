const mongoose = require('mongoose');

const IATicketSchema = mongoose.Schema(
    {
        CustomerId: {type: mongoose.Schema.Types.ObjectId, ref: 'IACustomer', required: true, index: true},
        Title: {type: String, required: true},
        Status: {type: String, required: true, enum: ['Open', 'In Progress', 'Replied', 'Pending', 'Closed']},
        Correspondence: [{
            Text: {type: String, required: true},
            Sender: {type: String, required: true},
            sentAt: {type: Date}
        }],
        SubjectId: {type: mongoose.Schema.Types.ObjectId}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('IATicket', IATicketSchema);