const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const mqttclient = require('../IAmqttclient');
// var server = require('../IAbroker');


const IADeviceSchema = mongoose.Schema(
    {
        HomeId: {type: Schema.Types.ObjectId, ref: 'IAHome', index: true},
        VendorId: {type: Schema.Types.ObjectId, ref: 'IAVendor'},
        Name: {type: String, required: true},
        // GPS: String,
        MAC: {type: String, index: true, sparse: true},//unique: true
        _MAC: {type: String, index: true},//, unique: true
        Password: String,
        IsActive: Boolean,
        DeviceType: String,//{type: String, ref: 'IADeviceType', key: 'DeviceType'},
        Removed: {type: Boolean, index: true, default: false},
        RemoveTime: Date,
        FirmwareSeries: Number,//can be null, using for OTA version of multi series devices with one DeviceType
        FirmwareVersion: Number,
        FirmwareUpdateTime: Date,
        Share: {
            Tokens: Number,
            GPS:{
                lat: Number,
                long: Number
            },
            EnabledAt: Date,
            DisabledAt: Date
        }
    },
    {
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    }
);

// IADeviceSchema.plugin(findOrCreate);


// Nodejs encryption with CTR
let crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    encpassword1 = 'SDfsae4d6F3Efeq';//todo get from config file

IADeviceSchema.statics.encryptid = function (text, encpassword) {
    let cipher = crypto.createCipher(algorithm, encpassword || encpassword1);
    let crypted = cipher.update(text, 'utf8', 'base64');
    crypted += cipher.final('base64');
    crypted = crypted.replace(/\//g, '~').replace(/\+/g, '_');
    return crypted;
}

IADeviceSchema.statics.decryptid = function (text, encpassword) {
    text = text.replace(/_/g, '+').replace(/~/g, '/');
    let decipher = crypto.createDecipher(algorithm, encpassword || encpassword1);
    let dec = decipher.update(text, 'base64', 'utf8');
    dec += decipher.final('utf8');
    // console.log('decryptid', text, dec);
    return dec;
}

IADeviceSchema.methods.SendPasswordToDevice = function () {
    let hashMac = Buffer.from(this.MAC).toString('base64');
    //TODO change to json message
    let encdeviceid = IADeviceSchema.statics.encryptid(this._id.toString());
    // console.log(data._id.toString(), encdeviceid, IADeviceSchema.decryptid(encdeviceid));
    //mqttclient.publish(hashMac, `YOUR_DEVICEID:${encdeviceid},YOUR_PASSWORD:${this.Password}`);

    /* old payload
     let message = {
     topic: hashMac,
     payload: `YOUR_DEVICEID:${encdeviceid},YOUR_PASSWORD:${this.Password}`,
     qos: 1, // 0, 1, or 2
     retain: false // or true
     };
     */

    let message = {
        topic: hashMac,
        payload: JSON.stringify({YOUR_DEVICEID: encdeviceid, YOUR_PASSWORD: this.Password}),//.replace(/"([^"]+)":/g, '$1:'),////dont use keys with cotation "
        qos: 1, // 0, 1, or 2 change x26
        retain: false // or true x26:false to true
    };


    let server = require('../../IAbroker');
    server.publish(message, function () {
        console.log('password sent to device'/*, this._id.toString(), this.Name*/);
    });
};

IADeviceSchema.methods.DeviceDelete = function () {
    // mqttclient.publish(this._encid, `RESET:123,YOUR_PASSWORD:223`);
    /*old payload
     let message = {
     topic: this._encid,
     payload: `RESET:123,YOUR_PASSWORD:223`,
     qos: 1, // 0, 1, or 2
     retain: false // or true
     };*/
    let message = {
        topic: this._encid,
        payload: JSON.stringify({RESET: 123, YOUR_PASSWORD: this.Password}),//.replace(/"([^"]+)":/g, '$1:'),
        qos: 1, // 0, 1, or 2
        retain: false // or true
    };
    let server = require('../../IAbroker');
    server.publish(message, function () {
        console.log('device reset command sent to it', message);
    });

    setTimeout(() => {
        let c = global.current.clients[this._encid];
        if (c) {
            c.close();
            delete global.current.clients[this._encid];
        }
    }, 3000);
};

IADeviceSchema.methods.SendFirmwareUpdate = function (firmurl, fingerprint, firmversion) {
    // let hashMac = Buffer.from(this.MAC).toString('base64');
    //TODO change to json message
    let encdeviceid = IADeviceSchema.statics.encryptid(this._id.toString());

    let _id = this._id;
    let name = this.Name;

    let message = {
        topic: encdeviceid,
        payload: JSON.stringify({
            FIRM_UPDATE: firmversion,
            FIRM_URL: firmurl,
            FINGERPRINT: fingerprint,
            FIRM_PASSWORD_10: this.Password.slice(0,10) //first 10 chars of password
        }),
        qos: 1, // 0, 1, or 2 change x26
        retain: false // or true x26:false to true
    };


    let server = require('../../IAbroker');
    server.publish(message, function () {
        console.log('firmware update sent to device', _id.toString(), name);
    });
};

IADeviceSchema.virtual('_encid').get(function () {
    return IADeviceSchema.statics.encryptid(this._id.toString());
});

IADeviceSchema.virtual('_online').get(function () {
    return !(global.current.clients[this._encid] === undefined);
});

IADeviceSchema.virtual('_lastState').get(function () {
    return global.lastState[this._encid];
});

IADeviceSchema.virtual('_DeviceType', {
    ref: 'IADeviceType', // The model to use
    localField: 'DeviceType', // Find people where `localField`
    foreignField: 'DeviceType', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true,
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});


module.exports = mongoose.model('IADevice', IADeviceSchema);
