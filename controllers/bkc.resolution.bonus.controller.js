const mongoose = require('mongoose');
const BKCResolutionBonusModel = require('../models/bkc.resolution.bonus.model');


mongoose.connection
    .once('open', async () => {
        //initializing
        console.log('initializing BKCResolutionBonusModel')
        await require('../models/bkc.resolution.bonus.model').static.initializexx();
    })
