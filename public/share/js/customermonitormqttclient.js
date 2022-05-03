
var username = "";
var password = "";
var client = {};
var mqttconnected = false;
var topiccolors = [];
//all devices of home
var devices = null;
//all installed services in home
// var installedServices = null;

function updateDevices(after, url) {
    if(!url)
        url = '/iadevice/home/';
    $.getJSON(url, function (devs) {
        devices = devs;
        home._devices = devs;
        //update localStorage by _lastState of each device
        for(var dev of devices){
            // console.error(dev.Name, dev._lastState)
            if(dev._lastState){
                var storstate = localStorage.getItem(dev._encid);
                if(storstate)
                    storstate = JSON.parse(storstate);
                else
                    storstate = {};
                // console.error('xxxx', storstate)
                Object.assign(storstate, dev._lastState);
                localStorage.setItem(dev._encid, JSON.stringify(storstate));
            }
        }
        if(after) after();
    })
}

function updateServices(after) {
    $.getJSON('/installedservice/home/', function (installedservices) {
        // services = installedservices;
        home._installedServices = installedservices;
        if(after) after();
    })
}

function mes(topic, msg1) {
    try {
        console.info('message', topic, msg1);

        var msg = JSON.parse(msg1);

        //prevent command appearance instead of state
        if(msg.command){
            console.log('message is command');
            return;
        }

        ///moved this action to IAbroker.js
        /*if(msg.state){
            msg.__statetime = msg.__receivetime;
        }*/

        //enabling senders
        if(disabledsenders[topic]) {
            $(disabledsenders[topic]).attr('disabled', false);
        }

        //last message
        //check pre stored time
        if(localStorage.getItem(topic)){
            var prestate = JSON.parse(localStorage.getItem(topic));
            var pretime = prestate.__receivetime;
            if(pretime >= msg.__receivetime){
                console.warn('receiver older message', msg);
                return;
            }
            Object.assign(prestate, msg);
            localStorage.setItem(topic, JSON.stringify(prestate));
        } else {
            // localStorage.setItem(topic, msg1);
            localStorage.setItem(topic, JSON.stringify(msg));
        }

        //save in history: no need anymore
        // IA_History._addHistory(topic, msg);

        var topicdiv = document.querySelector("[topicbox='" + topic + "']");
        if(topicdiv){
            //onmessage border
            topicdiv.classList.add("onmessage");
            setTimeout(function () {
                topicdiv.classList.remove("onmessage");
            }, 1000);

            //update elements
            for (var element in msg) {
                for (var z of document.querySelectorAll("[topicbox='" + topic + "'] [data=" + element + "]")) {
                    if ($(z).parents(".ss-hidden").length > 0) {
                        continue;
                    }

                    if(element === '__statetime'){
                        if(msg.state)
                            z.setAttribute("data-value", msg[element]);
                    }else {
                        z.setAttribute("data-value", msg[element]);
                    }

                    if (z.hasAttribute('data-update')) {
                        var dataUpdate = z.getAttribute('data-update');
                        try {
                            console.debug('data-update', dataUpdate);
                            eval(dataUpdate);
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        if (element === '__statetime') {
                            if(msg.state)
                                z.innerHTML = moment(msg[element]).fromNow();
                        } else if (element === '__receivetime') {
                            z.innerHTML = moment(msg[element]).fromNow();
                        } else {
                            console.debug('update '+element);
                            var unit = (devicetemps[devices.find(dev=>dev._encid===topic).DeviceType].data[element] || {}).unit || '';
                            z.innerHTML = msg[element] + ' ' + unit;
                        }

                        /*if(msg.state) {
                            if(devicetemps[devices.find(device => device._encid === topic).DeviceType].type ==="ACTUATOR") {
                                var chkcmd = document.querySelector("[topicbox='" + topic + "'] .commands input[type=checkbox]");
                                chkcmd.checked = devicetemps[devices.find(device => device._encid === topic).DeviceType].commands[1].state === msg.state;
                            }
                        }*/
                    }
                }
            }
        }

        //DEVICE_STATUS
        if(msg.DEVICE_STATUS) {
            if (msg.DEVICE_STATUS === "CONNECTED") {
                if(topicdiv) {
                    document.querySelector("[topicbox='" + topic + "'] span.onoffline").classList.add("online");
                    document.querySelectorAll("[topicbox='" + topic + "'] .commands").forEach(s=>s.classList.remove("offline"));
                }
                if(devices){
                    devices.filter(d=>d._encid===topic)[0]._online = true;
                }
            } else if (msg.DEVICE_STATUS === "DISCONNECTED") {
                if(topicdiv) {
                    document.querySelector("[topicbox='" + topic + "'] span.onoffline").classList.remove("online");
                    document.querySelectorAll("[topicbox='" + topic + "'] .commands").forEach(s=>s.classList.add("offline"));
                }
                if(devices){
                    var thedev = devices.filter(d=>d._encid===topic)[0];
                    thedev._online = false;
                    //SEM
                    thedev.SEMcurrents = [];
                }
            }


            return;
        }

        //SEM for element "current"
        if(devices && msg.current){//todo handle for other keys other than current for example current2
            if(typeof on_sem_live === 'function'){
                on_sem_live(topic, msg);
            }
        }

        //send notification:
        if(devices && msg.state) {//just show notification if msg has state
            if(IA_Notify)
                IA_Notify(devices.find(device => device._encid === topic).Name, msg.state);
            if(msg.state==='ERROR'){
                IA_Notifies._addMessage({
                    mes: devices.find(device => device._encid === topic).Name+' sent ERROR '+(msg.error ||''),
                    time: Date.now()
                });
            }
        }


    }catch (e){
        console.error(e)
    }
}

function subscribedevices() {
    if(home && devices) {
        for (var dev of devices) {
            subscribe(dev._encid);
        }
    } else {
        console.warn('home is not defined, subscribedevices failed')
    }
}

let inited = false;
function connectMqtt() {
    if(inited)
        return;
    inited = true;
    if(mqttconnected) {
        console.warn('connected before');
        subscribedevices();//TODO no subscribe every time , move subscribe to add device
        return;
    }
    $('#mqttconnectionicon').text('Connecting...');
    var tu2;
    try {
        if (tu2 = localStorage.getItem("tu2")) {
            tu2 = JSON.parse(tu2);
            // user.value = tu2.username;
        } else {
            username = 'xuser'+Math.floor(Math.random()*100000000000).toString()+'adminhome';// user.value;
            password = $.cookie('homeIdb');
            tu2 = {
                username: username,
                password: password,
                clientId: username,
                clean: true,//TODO clean was false check all thing is ok
                resubscribe: true,
                rejectUnauthorized: false
            };
            localStorage.setItem("tu2", JSON.stringify(tu2));
        }
    } catch (e){
        localStorage.removeItem("tu2");
        console.error(e);
    }

    // console.error('tu2', tu2)

    client = mqtt.connect(brokerUrl, tu2);

    client.on('connect', function () {
        if(mqttconnected) {
            console.log('is connected before');
            // subscribedevices();//TODO no subscribe every time , move subscribe to add device
            return;
        }
        mqttconnected = true;
        localStorage.setItem("tu2", JSON.stringify(tu2));
        subscribedevices();
        /*try{
            show_sspage("/customer/views/iadevice.customer.list.view.html")
        } catch (e){
            console.error(e)
        }*/
        console.info('connected to broker '+brokerUrl);
        $('#mqttconnectionicon').text(' ');
        changeStatusAll(true);
    });

    client.on('close', function () {
        mqttconnected = false;
        console.info('disconnected from broker '+brokerUrl);
        $('#mqttconnectionicon').text('Connecting...');
        changeStatusAll(false);
    });

    client.on('error', function (err) {
        console.error(err);
        client.end();
    });

    client.on('message', function (topic, message, packet) {
        // message is Buffer

        mes(topic, message.toString());

//        client.end()
    });


}

function changeStatusAll(status){
    var f = function (){
        if(status){
            for(var dev of devices) {
                if(dev._online) {
                    // document.querySelector("[topicbox='" + dev._encid + "'] span.onoffline").classList.add("online");
                    document.querySelectorAll("[topicbox='" + dev._encid + "'] .commands").forEach(s => s.classList.remove("offline"));
                }
            }
        } else {
            for(var dev of devices) {
                // document.querySelector("[topicbox='" + dev._encid + "'] span.onoffline").classList.remove("online");
                document.querySelectorAll("[topicbox='" + dev._encid + "'] .commands").forEach(s => s.classList.add("offline"));
            }
        }
    }
    if(!devices)
        updateDevices(f);
    else
        f();

}


var disabledsenders = {};
function publishCommand(topic, command, sender) {
    //check mqttconnected
    if(!mqttconnected){
        swal.fire("Connection Failed", "BKC Control Panel could not connect to the server, Check Internet connection.", "error");
        console.log('Mqtt connection is closed, publishing failed.')
        return false;
    }

    //check device is online
    if(!devices.find(d=>d._encid===topic)._online){
        console.log('device is not online, publishing failed.')
        return false;
    }

    var _payload = '';
    if(typeof command === 'object'){
        _payload = JSON.stringify(command);
    } else {
        _payload = '{"command":"'+command+'"}';
    }

    //disabling sender
    if(sender){
        disabledsenders[topic] = sender;
        $(sender).attr('disabled',true);
    }

    client.publish(
        topic,
        _payload
        ,
        {
            qos: 1
        },
        function (err) {
            //todo need handle err
            if(err){
                console.error(err);
            }
            console.info('published')
        }
    );
}

function publishCommandConfirm(topic, command, sender, confirm){
    if(confirm) {
        swal.fire({
            title: confirm.title,
            html: confirm.html,
            // imageUrl: "images/error.png",
            // imageWidth: 50,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: confirm.buttonText
        }).then((result) => {
            if (result.value) {
                publishCommand(topic, command, sender);
            }
        });
    } else {
        publishCommand(topic, command, sender);
    }
}


/*function publish() {
    client.publish(
        topic.value,
        payload.value,
        {
            qos: 1
        },
        function (err) {
            console.log('published')
        }
    );
}*/

function subscribe(top) {
    client.subscribe(top , function (err) {
        if (err) {
            message.value += err;
        }
        console.info('subscribed to '+top);
    })
}

var table = document.getElementById('mqttlogsparent');
function log(topic, msg) {
    try {
        msg = JSON.parse(msg.toString());
        /*var logdiv = document.getElementById('adminlog');
        logdiv.innerHTML += '<div class="log">' +
            '<div class="sender">' + msg.sender + ' => ' + msg.topic + '</div>' +
            '<div class="payload" title="' + msg.time + '">' + msg.payload + '</div>' +
            '</div>';
        logdiv.scrollTop = logdiv.scrollHeight;
        message.scrollTop = message.scrollHeight;*/


        var topiccolor = '';
        if(! (topiccolor=topiccolors[msg.topic])){
            topiccolor = Math.floor(Math.random()*16777215).toString(16);
            topiccolors[msg.topic] = topiccolor;
        }

        var devicecolor = '';
        if(! (devicecolor=topiccolors[msg.sender])){
            devicecolor = Math.floor(Math.random()*16777215).toString(16);
            topiccolors[msg.sender] = devicecolor;
        }

        $('#mqttlogs tr:last').after(`<tr>
                                            <td><i class="material-icons">message</i></td>
                                            <td><span class="label" style="background-color: #${devicecolor}">${msg.sender}</span></td>
                                            <td><span class="label" style="background-color: #${topiccolor}">${msg.topic}</span></td>
                                            <td style="${msg.authorized?'':'text-decoration:line-through;text-style:italic;color:red'}">${msg.payload}</td>
                                            <td>${msg.qos || '?'}</td>
                                        </tr>`);
        table.scrollTop = table.scrollHeight;
    } catch (e){}
}

$(function () {
    setTimeout(()=>connectMqtt() , 5000)
})