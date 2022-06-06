var express = require('express');
var router = express.Router();
const installedservice = require('../controllers/installedservice.controller');

// Create a new installedService
router.post('/', installedservice.create);

// Retrieve all installedServices
router.get('/', installedservice.findAll);

// Retrieve all installed services in home with homeId in url
router.get('/home/:homeId', installedservice.findHomeInstalledServices);

// Retrieve all installed services in home with homeId in header
router.get('/home/', installedservice.findHomeInstalledServices);

// Retrieve a single installedService with installedServiceId and run it
router.post('/run/:installedServiceId', installedservice.callRun);

// Retrieve a single installedService with installedServiceId
router.get('/:installedServiceId', installedservice.findOne);

// Update a installedService with installedServiceId
router.put('/:installedServiceId', installedservice.update);

// Delete a installedService with installedServiceId
router.delete('/:installedServiceId', installedservice.delete);


module.exports = router;