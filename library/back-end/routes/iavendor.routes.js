var express = require('express');
var router = express.Router();
const iavendor = require('../controllers/iavendor.controller');

// Create a new Note
router.post('/', iavendor.create);

// Retrieve all Notes
router.get('/', iavendor.findAll);

// Retrieve a single Note with vendorId
router.get('/:vendorId', iavendor.findOne);

// Update a Note with vendorId
router.put('/:vendorId', iavendor.update);

// add user to vendor
router.post('/user/:vendorId', iavendor.addUser);

// change user roles
router.put('/user/:vendorId', iavendor.changeUser);

// delete user from vendor
router.delete('/user/:vendorId/:userId', iavendor.deleteUser);

// Delete a Note with vendorId
router.delete('/:vendorId', iavendor.delete);


module.exports = router;