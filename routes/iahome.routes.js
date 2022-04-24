var express = require('express');
var router = express.Router();
const iahome = require('../controllers/iahome.controller');

// Create a new Home
router.post('/', iahome.create);

// Retrieve all Homes
router.get('/', iahome.findAll);

// Retrieve a single Home with homeId
router.get('/:homeId', iahome.findOne);

// Update a Home with homeId
router.put('/:homeId', iahome.update);

//Update home armed status
router.put('/guard/:newGuard', iahome.changeGuard);

// Delete a Home with homeId
router.delete('/:homeId', iahome.delete);


module.exports = router;