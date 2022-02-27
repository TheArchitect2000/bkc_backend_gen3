var express = require('express');
var router = express.Router();
const iaactivity = require('../controllers/iaactivity.controller');

// Retrive sem activities
router.get('/home/sem', iaactivity.findHomeSEN);
// Retrieve all activities of home
router.get('/home/:records', iaactivity.findHomeActivities);

//todo remove me
// router.get('/awardbonus', iaactivity.awardBonusTokens);


module.exports = router;