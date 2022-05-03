var express = require('express');
var router = express.Router();
const iaservice = require('../controllers/iaservice.controller');

// Create a new service
router.post('/', iaservice.create);

// Retrieve all services
router.get('/', iaservice.findAll);

// Retrieve services for this vendorId
router.get('/developer/vendor/:vendorId', iaservice.findVendorServices);

// Retrieve services for this developerid
router.get('/developer/:developerId', iaservice.findDeveloperServices);

// Retrieve services for this developer which has logon
router.get('/developer/', iaservice.findDeveloperServices);

//add new release
router.post('/release/:serviceId', iaservice.addRelease);

//delete release
router.delete('/release/:serviceId/:releaseId', iaservice.deleteRelease);

//change release Survey Result
router.put('/release/:serviceId/:releaseId', iaservice.surveyRelease);


// Comments of service
router.get('/comments/:serviceId', iaservice.getComments);

// Comments of service
router.post('/comments/:serviceId', iaservice.addComment);

// Retrieve services selectable in service gallery
router.get('/gallery/', iaservice.findPublishedServices);

// Retrieve services requested to publish
router.get('/admin/', iaservice.findNewReleases);

// get icon of service
router.get('/icon/:serviceId', iaservice.getIcon);

// Retrieve a single Service with serviceId
router.get('/:serviceId', iaservice.findOne);


// Update a service with serviceId
router.put('/:serviceId', iaservice.update);

// Delete a service with serviceId
router.delete('/:serviceId', iaservice.delete);


module.exports = router;