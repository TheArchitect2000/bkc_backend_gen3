var express = require('express');
var router = express.Router();
const iadevicetype = require('../controllers/iadevicetype.controller');

// Create a new device type
router.post('/', iadevicetype.create);

// Retrieve all devicetypes
router.get('/', iadevicetype.findAll);

// Retrieve devicetypes for this vendorId
router.get('/vendor/:vendorId', iadevicetype.findVendorDeviceTypes);

// Retrieve devicetypes for this developerid
// router.get('/developer/:developerId', iadevicetype.findDeveloperdevicetypes);

// Retrieve devicetypes for this developer which has logon
// router.get('/developer/', iadevicetype.findDeveloperdevicetypes);

// Publish this device type
router.get('/publish/:Id', iadevicetype.publishVersion);

// Comments of device type
// router.get('/comments/:Id', iadevicetype.getComments);

// Comments of device type
// router.post('/comments/:Id', iadevicetype.addComment);

// Retrieve devicetypes selectable in device type gallery
router.get('/gallery/', iadevicetype.findPublishedDeviceTypes);

// get icon of device type
router.get('/icon/:Id', iadevicetype.getIcon);

// Retrieve a single Device Type with Id
router.get('/:Id', iadevicetype.findOne);


// Update a device type with Id
router.put('/:Id', iadevicetype.update);

// Delete a device type with Id
router.delete('/:Id', iadevicetype.delete);


module.exports = router;