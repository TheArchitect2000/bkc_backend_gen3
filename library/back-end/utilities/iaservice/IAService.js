const {VM, VMScript} = require('vm2');
// const request = require('request');

const IADevice = require('../../models/iadevice.model');
const IAService = require('../../models/iaservice.model');
const IAHome = require('../../models/iahome.model');
const IACustomer = require('../../models/iacustomer.model');
const InstalledService = require('../../models/installedservice.model');
const IABTt = require('../../models/iabt_transfer.model');

class DeviceMate {
    /**
     * constructor of this service
     * @param Device
     * @param Name
     * @param _id
     * @param Title
     */
    constructor(Device, Name, _id, Title) {
        this.Title = Title;
        this.Device = Device; //an item in iaservice.Devices[]
        this.Name = Name;
        this._id = _id;//TODO how to hide this id?
    }

    /**
     * send message to outside of service to owner of service
     * @param message
     */
    SEND_MESSAGE(message) {

    }

    /**
     *
     * @param command
     * @param options
     * @returns {boolean}
     * @constructor
     */
    SEND_COMMAND(command, options) {
        //prevent loop of send_command and invoke this service
        if(this.Device.Invoker && ! this.Device.Receiver){
            console.error(`Prevent send command to device ${this.Name}`);
            return false;
        }

        if(options){
            command = {
                command: command
            };
            Object.assign(command, options);
            command = JSON.stringify(command);
        } else {
            command = '{"command":"' + command + '"}';
        }

        console.debug('sending command to ' + this.Name + ' ' + this._enid + ' ' + command);
        let message = {
            topic: IADevice.encryptid(this._id),
            payload: command,
            qos: 1,
            retain: false // or true
        };

        IAServiceRunner.iabroker.publish(message, function () {
            console.debug('send command done!', message);
        });
        return true;
    }
}

//components:
const iamailer = require('../iacommunication/iamailer');
const iasms = require('../iacommunication/iasms');
const iapush = require('../iacommunication/iapush');
const IAMessage = {
    /**
     *
     * @param mailOptions like {
         from: '"BKC Smart Home" iasmarthome@internetanywhere.io',//NOT REQUIRED
         to: 'salartayefeh@gmail.com',//NOT REQUIRED
         subject: 'with iamailer',
         text: 'Expired Certificate Errors A roll out of new certificates last week has caused some users to experience problems sending mail—this was due to the expiration of the old certificate and an issue in our configuration. The users effected were sending through SMTP with STARTTLS. HTTPS API calls were not affected. We are currently working on a fix and will update when resolved. 12:21 PM UTC The configuration error was corrected at 12:05 UTC. SMTP with STARTTLS is now working correctly in all regions. December 18, 2015 12:04 PM UTC77!',
         html: '<p>My Noora <font color="red">Hi hello</font> </p>'
         };
     */
    sendMail : function (mailOptions) {
        mailOptions.to = this._userinfo.Username;//Email is Username
        iamailer.sendMail(mailOptions);
    },
    /**
     *
     * @param smsOptions like {
            "MobileNo": "09123232323",//NOT REQUIRED
            "message": "Salam"
         }
     */
    sendSMS : function (smsOptions) {
        //set smsOptions.MobileNo according to customer info
        smsOptions.MobileNo = this._userinfo.Mobile;
        //TODO disabled now iasms.sendSMS(smsOptions);
    },
    /**
     *
     * @param pushOptions like {
            "Subscription": "09123232323",//NOT REQUIRED
            "message": "Hello Customer"
         }
     */
    pushNotification : function (pushOptions) {
        //set pushOptions.Subscription according to customer info
        pushOptions.Subscription = this._userinfo.NotifySubscription;
        iapush.pushNotification(pushOptions);
    }
};

const Service_Contract = {
    transfer : async function (from, to) {
        console.log('service contract', from, to);
        //todo from is now current home customerID
        //to is name of device in service, need to find its id and its home and customer id
        let toDeviceId = this.iService.Devices.find(dev=>dev.name===to).value;
        let toDevice = await IADevice.findOne({_id: toDeviceId}).populate('HomeId');
        let toBKC = toDevice.Share.Tokens;
        // let tohomeid = toDevice.HomeId;
        let toCustomerId = toDevice.HomeId.CustomerId;// await IAHome.findOne({_id: tohomeid}).CustomerId;
        let fromHome = await IAHome.findOne({_id: this.iService.HomeId});
        let fromCustomerId = fromHome.CustomerId;
        try {
            let tResult = await IABTt.transfer(fromCustomerId, toCustomerId, toBKC, IABTt.TransferCases().SERVICE_TRANSFER, `Transfer to shared device`);
            canRun = tResult.TransferOK;
        }catch (err){
            console.error(err);
            canRun = false;
            /*res.status(500).send({ //TODO send notification or email
                message: err.TransferString || "Some error occurred while running service."
            });*/
        }
    },
    iService: null
}

const IAServiceRunner = {
    onPublish(IAbroker, topic, payload) { //topic is equal device id

        // set IAbroker
        this.iabroker = IAbroker;

        //find device by topic
        //todo need caching for speed
        let _id = 0;
        try {
            _id = IADevice.decryptid(topic);
        } catch (e) {
            return;
        }
        IADevice.findById(_id)
            .then(iadevice => {
                console.log('ServiceRunner.publish invokerDevice is: ', _id, iadevice.Name);
                let invokerDevice = iadevice;
                //find installedservices which have Devices by this device id
                InstalledService.find({"Devices": {$elemMatch: {"value": invokerDevice._id.toString()}}}).then(iServices => {
                    // console.log(iServices);
                    /*let iServices = selectedServices.filter(s => Object.values(s.inputs).includes(topic));*/
                    for (let iService of iServices) {
                        IAServiceRunner.runService(iService, invokerDevice, _id, payload)
                    }
                })
            }).catch(err => {
                //console.error(_id, err);
            });

        // console.log('sss')


    },
    async runService(iService, invokerDevice, invokerId, payload, vmFunction) {
        console.debug('runService:',iService._id, iService.HomeId,new Date());

        if(iService.Activated === false){
            console.log('Service is inactive. ignored!');
            return;
        }

        //// IAService.findById(iService.ServiceId).then(async service => {
        ////     service = service.toObject();
        // let service = iService.ServiceSnapshot;
        let theservice = await IAService.findById(iService.ServiceId);
        let version = iService.ServiceVersion;
        console.log('run service '+theservice.Name+' version '+version);
        let service;
        if(version===0){//install service directly without release version
            service = theservice;
        } else if(version>0){//install service by a release
            service = theservice.Publish.Releases.find(r=>r.Version ===version).Snapshot;
        } else {
            console.error('bad service');
            return;
        }
        //TODO check home access
        // all fields of IAHome is -_id -Name -CustomerId IsActive -Address Guard Type
        let theHome = await IAHome.findById(iService.HomeId , " IsActive Guard Type CustomerId").populate('CustomerId', " Username Mobile NotifySubscription");
        // let theCustomer = await IACustomer.findById(theHome.CustomerId , " Username Mobile NotifySubscription");
        let theCustomer = theHome.CustomerId;

        let _IAMessage = {...IAMessage};
        let _Service_Contract = {...Service_Contract};
        _Service_Contract.iService = iService;
        _IAMessage._userinfo = theCustomer;
        let sandbox = {
            Service_Contract: _Service_Contract,
            IAMessage: _IAMessage,
            request: require('request'),
            Home: theHome, //TODO check is needed?
        };
        let canRun = (!invokerId && !invokerDevice);



        // devices
        //// let devices = {...iService.Devices};
        ////dev.value is _id of device
        if(iService.Devices) {
            for (let dev of iService.Devices) {
                let device = service.Devices.filter(d=>d.Name===dev.name)[0];//an iaservice.Devices[] item
                let devmate = new DeviceMate(device, dev.name, dev.value, invokerDevice?invokerDevice.Name:'');
                if (dev.value === invokerId) {
                    //allow run service if this device is a device in iadevice.Devices with Invoker=true
                    if(device.Invoker){
                        canRun = true;
                    }
                    devmate.PAYLOAD = JSON.parse(payload);
                } else {
                    devmate.PAYLOAD = lastState[IADevice.encryptid(dev.value)];
                }
                sandbox[dev.name] = devmate;
            }
            // console.debug('devices added to sandbox', iService.Devices)
        }

        //dont continue if Invoker is not a device invoker in this service
        if(!canRun){
            return;
        }

        //give Token for run service
        if(service.Price.Run && service.Price.Run > 0) {
            try {//todo change toid to service.VendorId.CustomerId for vendor when service.VendorId has value
                let tResult = await IABTt.transfer(theHome.CustomerId, service.DeveloperId, service.Price.Run, IABTt.TransferCases().SERVICE_RUN, `Run Service "${service.Name}"`);
                canRun = tResult.TransferOK;
            }catch (err){
                console.error(err);
                canRun = false;
                /*res.status(500).send({ //TODO send notification or email
                    message: err.TransferString || "Some error occurred while running service."
                });*/
            }
        }

        // don't run if not enough token
        if(!canRun){
            return;
        }

        // Variables
        if(iService.Vars) {
            for (let v of iService.Vars) {
                sandbox[v.name] = v.value;
            }
            // console.debug('vars added to sandbox', iService.Vars)
        }
        // console.log('sandbox', sandbox);

        const vm = new VM({
            // timeout: 10,
            sandbox: sandbox
        });
        let iasrvcode;
        try {
            console.time('compile');
            iasrvcode = service.Code.replace(/\\n/g, '');
            if(vmFunction){
                iasrvcode += "\n\n"+vmFunction+"();";
            }
            var script = new VMScript(iasrvcode).compile();
            console.timeEnd('compile');
        } catch (err) {
            console.error('Failed to compile script.', err);
        }

        try {
            console.time('run');
            var out = vm.run(script);
            console.timeEnd('run');
            console.debug('run successful:',iasrvcode, out)
        } catch (err) {
            console.error('Failed to execute script.', err);
        }

        //TODO refund tokens
        //})
    }
}


module.exports = IAServiceRunner;


process.on('uncaughtException', (err) => {
    console.error('Asynchronous error caught.', err);
})
