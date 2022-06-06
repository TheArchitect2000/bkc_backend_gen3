var express = require('express');
var router = express.Router();
const iadevice = require('../controllers/iadevice.controller');

// Create a new Device
router.post('/', iadevice.create);

// Retrieve all Devices
router.get('/', iadevice.findAll);

// Retrieve all devices in home with homeId in url
router.get('/home/:homeId', iadevice.findHomeDevices);

// Retrieve all devices shared with home with homeId in url
router.get('/shared/:homeId', iadevice.findSharedDevicesWithHome);

// Retrieve all devices in vendor with vendorId in session and device type _id in url
router.get('/vendor/:deviceTypeId', iadevice.findVendorDevices);

// Retrieve all devices in home with homeId in header
router.get('/home/', iadevice.findHomeDevices);

// Retrieve a single Device with deviceId
router.get('/:deviceId', iadevice.findOne);

// Update a Device with deviceId
router.put('/:deviceId', iadevice.update);

// Update firmware of Device with deviceId
router.put('/firmware/:deviceId', iadevice.firmwareupdate);

// Delete a Device with deviceId
router.delete('/:deviceId', iadevice.delete);


module.exports = router;
