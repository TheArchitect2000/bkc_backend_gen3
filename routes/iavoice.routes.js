var express = require('express');
var router = express.Router();
const iavoice = require('../controllers/iavoice.controller');

// ia panel set a random 4 digit password for user by homeid which expires after one minute
router.get('/getiavpassword', iavoice.getiavpassword);

//list of pre success logins and joins to voice platforms
router.get('/getprelogins', iavoice.getprelogins);

//for disconnect from a voice platform
router.delete('/disconnect/:iavoiceId', iavoice.disconnect);

/*
// Create a new Note
router.post('/', iavoice.create);

// Retrieve all Notes
router.get('/', iavoice.findAll);

// Retrieve a single Note with vendorId
router.get('/:vendorId', iavoice.findOne);

// Update a Note with vendorId
router.put('/:vendorId', iavoice.update);

// Delete a Note with vendorId
router.delete('/:vendorId', iavoice.delete);
*/


module.exports = router;