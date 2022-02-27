'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const fs = require('fs');
var Client = require('node-rest-client-promise').Client;
//ia broker client
var iabclient = new Client();
iabclient.registerMethodPromise("whoisme", "http://localhost:50500/customer/whoisme", "POST");
iabclient.registerMethodPromise("deviceaction", "http://localhost:50500/customer/deviceaction", "POST");
// iabclient.registerMethod("jsonMethod", "http://remote.site/rest/json/${id}/method", "GET");



const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------
let linelog = '--------------------------------------------------------------';

app.setHandler({
    /*LAUNCH() {
        console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },*/

    /*check_user() {
        console.log(linelog,'check user is ',this.$user.isNew(), this.$user.getId(), this.getType(), linelog);
        if(iavoiceUsers[this.$user.getId()]){
            return this.toIntent('RootIntent');
        } else {
            return this.toIntent('LoginIntent');
        }
    },*/

    async LAUNCH() {
        console.log(linelog, 'LAUNCH HHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
        await iabclient.methods.whoisme({
            data: {
                check : true,//for check user , if no check key means it is first login
                // password: this.$user.$data.iauser.password,
                jovouserid: this.$user.getId(),
                platform: this.getType()
            },
            headers: {"Content-Type": "application/json"}
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;
            if (data.valid) {
                return this.toIntent('RootIntent');
            } else {
                return this.toIntent('LoginIntent');
            }
        }).catch(err=>{
            console.error('err1', err);
            // iavoiceUsers[thes.$user.getId()] = data;
            return this.toIntent('LoginIntent');
        });
    },

    /*async NEW_SESSION() {
        console.log(linelog, 'NEW SESSSSSSSSSSSSSSSSSSION');
        // return this.check_user();
        console.log(linelog,'check user is ',this.$user.isNew(), this.$user.getId(), this.getType(), linelog);
        /!*if(iavoiceUsers[this.$user.getId()]){
            //return this.toIntent('RootIntent');
        } else {
            return this.toIntent('LoginIntent');
        }*!/
        /!*if(!this.$user.$data.iauser){
            return this.toIntent('LoginIntent');
        } else {
            console.log('user data is ',this.$user.$data.iauser)
        }*!/
        await iabclient.methods.whoisme({
            data: {
                check : true,//for check user , if no check key means it is first login
                // password: this.$user.$data.iauser.password,
                jovouserid: this.$user.getId(),
                platform: this.getType()
            },
            headers: {"Content-Type": "application/json"}
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;
            if (data.valid) {

            } else {
                return this.toIntent('LoginIntent');
            }
        }).catch(err=>{
            console.error('err1', err);
            // iavoiceUsers[thes.$user.getId()] = data;
            return this.toIntent('LoginIntent');
        });
    },*/

    /*async NEW_USER() {
        console.log(linelog, 'NEW Userr');
        // this.$user.$data.someData = await collectSomeData();
    },*/

    ON_REQUEST() {
        // console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        console.log(linelog, 'on REQUESSST');
        if(!this.$user.$data.iauser && this.$request.getIntentName()!=='MyIASecretIsIntent'){
            return this.toIntent('LoginIntent');
        }
    },

    END() {
        console.log(linelog, 'END END END END END END END END END ');
        // Triggered when a session ends abrupty or with AMAZON.StopIntent
    },

    /*wait1(ms) {
        return new Promise(r => setTimeout(r, ms));
    },*/

    LoginIntent() {
        this.ask('Welcome to Blocklychain. Unfortunately, I cannot recognize you, To introduce yourself to me, please read your voice password for me',
            'To find your voice password, please go to your Blocklychain panel, go to the Setting page, go to the "Voice Command" tab.');
    },

    /*async LoginIntent() {
        console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        this.tell('OK please waite');
        await this.wait1(5000);
        this.ask('Hello dear user! I don\'t know you !!5s What\'s your Blocklychain secret?', 'Please tell me your Blocklychain secret so I know you.');
    },*/

    RootIntent() {
        // return this.check_user();
        // console.log(linelog,'user is ',this.$user.isNew(), this.$user.getId(), linelog);
        this.ask('What I can to do now?', 'How can I help you?');
    },

    MyNameIsIntent() {
        this.ask('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

    async MyIASecretIsIntent() {
        let thes = this;
        console.log('user.$data',thes.$user.$data);
        await iabclient.methods.whoisme({
            data: {
                password: thes.$inputs.secret.value,
                jovouserid: thes.$user.getId(),
                platform: thes.getType()
            },
            headers: {"Content-Type": "application/json"}
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;
            if (data.valid) {
                thes.$user.$data.iauser = data;
                // iavoiceUsers[thes.$user.getId()] = data;
                thes.ask('Hey ' + data.FirstName + ', nice to meet you here. I can detect you from now on.','What I can to do now?');
                //save iavoiceUsers to file

                // fs.writeFileSync('iavoiceUsers.json',JSON.stringify(iavoiceUsers));
            } else {
                delete thes.$user.$data.iauser;
                thes.ask('Unfortunately I can not detect you. please try again.','If you now has your password say like :"My password is 11 22"');
            }
        }).catch(err=>{
            console.error('err1', err);
            // iavoiceUsers[thes.$user.getId()] = data;
            thes.tell('Unfortunately I can not detect you. please try later.');
        });
    },

    Unhandled() {
        console.warn('Unhandled voice request');
        console.log(this.$inputs);
        // return this.toIntent('LAUNCH');
    },

    ON_ERROR() {
        console.log(`Error: ${JSON.stringify(this.$alexaSkill.getError())}`);
        console.log(`Request: ${JSON.stringify(this.$request)}`);

        this.ask('There was an error. Can I help you in any other way?');
    },

    ///////////////

    async LastStateIntent() {
        let thes = this;
        let devicename = thes.$inputs.device.value;
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                device: this.$inputs.device.value,
                action: 'LAST_STATE'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                let mes = 'The status of this device is unclear!';
                console.log(data);
                if(!data.lastState || data.lastState==='undefined'){

                } else if(!data.lastState.Connected){
                    mes ='device '+devicename+' is not connected!';
                } else if(data.lastState.state) {
                    mes = devicename + ' state is '+ data.lastState.state
                }
                thes.ask(mes, 'Is there another order?')
            } else {
                thes.ask('I could not check status of '+ devicename+'. '+data.message, 'Can I get another help?');
            }
        }).catch(err=>{
            console.error(err);
            thes.tell('Unfortunately I could not check status of '+ devicename);
        });
    },

    async DevicesListIntent() {
        let thes = this;
        let devices = thes.$inputs.devices.value;
        if (devices==='devices'){

        }
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                action: 'DEVICES_LIST'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                let mes = 'The status of devices is unclear!';
                console.log(data);
                if(data.devices){
                    mes = 'you have '+ data.devices.length+' devices in your smart home named ';
                    let i = 1;
                    for(let dev of data.devices){
                        if(i > 1)
                            mes += (i === data.devices.length)?' and ':', ';
                        i++;
                        mes += '"'+dev.Name+'"'
                    }
                }
                thes.ask(mes,'What else I can to do ?')
            } else {
                thes.ask('I could not check list of devices','Do you have new order?');
            }
        }).catch(err=>{
            console.error(err);
            thes.tell('Unfortunately I could not check status of '+ devicename);
        });
    },

    async TurnOnIntent() {
        let thes = this;
        let devicename = thes.$inputs.device.value;
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                device: this.$inputs.device.value,
                action: 'TURN_ON'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                console.log(data);
                if(!data.lastState){
                    thes.ask('I tried to turn on ' + devicename+'. The status of this device is unclear!','What I can to do now?');
                } else if(!data.lastState.Connected){
                    thes.ask('device '+devicename+' is not connected!', 'What I can to do?');
                } else {
                    let mes = '';
                    if(data.lastState.state === 'ON') {
                        mes = 'OK I turned on ' + devicename+'.';
                    } else {
                        mes = 'I tried to turn on ' + devicename+'.';
                    }
                    thes.tell(mes);
                }
            } else {
                thes.ask('I could not turn on '+ devicename+'. '+data.message, 'What I can to do now?');
            }
        }).catch(err=>{
            console.error(err);
            thes.tell('Unfortunately I could not turn on '+ devicename);
        });
    },

    async TurnOffIntent() {
        let thes = this;
        let devicename = thes.$inputs.device.value;
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                device: this.$inputs.device.value,
                action: 'TURN_OFF'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                console.log(data);
                if(!data.lastState.Connected){
                    thes.ask('device '+devicename+' is not connected!', 'What I can to do now?');
                } else {
                    let mes = '';
                    if(data.lastState.state === 'OFF') {
                        mes = 'OK I turned off ' + devicename+'.';
                    } else {
                        mes = 'I tried to turn off ' + devicename+'.';
                    }
                    thes.tell(mes);
                }
            } else {
                thes.ask('I could not turn off '+ devicename, 'What else I can to do?');
            }
        }).catch(err=>{
            console.error('err2 ', err);
            thes.tell('Unfortunately I could not turn off '+ devicename);
        });
    },

    async PlayIntent() {
        let thes = this;
        let devicename = thes.$inputs.device.value;
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                device: this.$inputs.device.value,
                action: 'PLAY'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                console.log(data);
                if(!data.lastState.Connected){
                    thes.ask('device '+devicename+' is not connected!', 'What I can to do now?');
                } else {
                    let mes = '';
                    if(data.lastState.state === 'PLAYING') {
                        mes = 'OK ' + devicename+' is playing now.';
                    } else {
                        mes = ' Aha, ' + devicename+' may start playing now.';
                    }
                    thes.tell(mes);
                }
            } else {
                thes.ask('I could not to play '+ devicename, 'What I can to do now?');
            }
        }).catch(err=>{
            console.error('err2 ', err);
            thes.tell('Unfortunately I could not to play '+ devicename);
        });
    },

    async PauseIntent() {
        let thes = this;
        let devicename = thes.$inputs.device.value;
        await iabclient.methods.deviceaction({
            data: {
                jovouserid: this.$user.getId(),
                homeId: this.$user.$data.iauser.homeId,
                device: this.$inputs.device.value,
                action: 'PAUSE'
            },
            headers: { "Content-Type": "application/json" }
        }).then( (data1, response1) => {
            let data = data1.data;
            let response = data1.response;

            if(data.done){
                console.log(data);
                if(!data.lastState.Connected){
                    thes.ask('device '+devicename+' is not connected!', 'What I can to do?');
                } else {
                    let mes = '';
                    if(data.lastState.state === 'PAUSED') {
                        mes = 'OK ' + devicename+' is paused now.';
                    } else {
                        mes = ' It appears ' + devicename+' is paused.';
                    }
                    thes.tell(mes);
                }
            } else {
                thes.ask('I could not to pause '+ devicename, 'What I can to do?');
            }
        }).catch(err=>{
            console.error('err2 ', err);
            thes.tell('Unfortunately I could not to pause '+ devicename);
        });
    }
});

module.exports.app = app;
