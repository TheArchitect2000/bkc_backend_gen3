var express = require('express');
var router = express.Router();
const iaticket = require('../controllers/iaticket.controller');

// Create a new ticket
router.post('/', iaticket.createorpush);

// Retrieve all tickets of a customer
router.get('/', iaticket.findAllCustomerIATickets);

// Retrieve all tickets for admin
router.get('/admin', iaticket.findAllIATicketsforAdmin);

// Retrieve a single Note with vendorId
// router.get('/:vendorId', iaticket.findOne);

// Update a Note with vendorId
// router.put('/:vendorId', iaticket.update);

// Delete a Note with vendorId
// router.delete('/:ticketId/:ticketName', iaticket.delete);


module.exports = router;