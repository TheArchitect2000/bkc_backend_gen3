var express = require('express');
var router = express.Router();
const iafileserver = require('../controllers/iafileserver.controller');
var multer  = require('multer');
var upload = multer({ dest: 'resources/fileserver/' });
let fstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/firmwares/');
    },
    filename: function (req, file, cb) {
        let filename = req.body['DeviceType']
        if(req.body['Series'] && parseInt(req.body['Series']) > 0)
            filename += '-' + req.body['Series'];
        filename += '-' + req.body['Version'];
        filename += '.bin'
        cb(null, filename );
    }
});
let uploadfirmware = multer({ storage: fstorage});

// let uploadform = upload.single('filename')
// let uploadform = upload.array('filename', 12)
let uploadform = upload.fields([{ name: 'audio-file', maxCount: 1 }/*, { name: 'record-file', maxCount: 1 }*/]);

// Create a new file
router.post('/', uploadform, iafileserver.create);

// Create a new firmware file
router.post('/firmware', uploadfirmware.fields([{ name: 'firm-file', maxCount: 1 }]), iafileserver.createfirmware);

// Retrieve all files of a customer
router.get('/:userspace/:mime/:folder', iafileserver.findAllCustomerFiles);

// Retrieve a single Note with vendorId
// router.get('/:vendorId', iafileserver.findOne);

// Create playlist
router.put('/playlist', iafileserver.createPlaylist);

// Update playlist
router.post('/playlist', iafileserver.updatePlaylist);

// change file playlist
router.patch('/playlist', iafileserver.copyToPlaylist);

// Delete playlist
router.delete('/playlist', iafileserver.deletePlaylist);

// Delete a file with fileid and filename
router.delete('/:fileId/:fileName', iafileserver.delete);


module.exports = router;