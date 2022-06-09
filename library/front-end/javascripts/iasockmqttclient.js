///this file used in a...n
var username = "";
var password = "";
// brokerUrl in configs.js
// var brokerUrl = 'mqtt://149.56.252.33:3001';
// var brokerUrl = 'mqtt://localhost:3001';
var client = {};
var topiccolors = [];

function connect() {
    username = 'xuser'+Math.floor(Math.random()*100000000000).toString()+'admin';// user.value;
    password = username + "IA";

    var tu = {
        username: username,
        password: password,
        clientId: username ,
        clean: true,//false
//            resubscribe: true
    };

    client = mqtt.connect(brokerUrl, tu);

    client.on('connect', function () {
        localStorage.setItem("tu", JSON.stringify(tu));
        // $(user).addClass("green");
        subscribe('admin/publishes');
        console.log('connected to broker '+brokerUrl)
    });

    client.on('message', function (topic, message, packet) {
        // message is Buffer
        console.log(packet);

        if(topic == 'admin/publishes'){
            log(topic, message, packet);
        } else {
            mes(topic, message.toString());
        }

//        client.end()
    });
}

try {
    var tu;
    if (tu = localStorage.getItem("tu")) {
        tu = JSON.parse(tu);
        user.value = tu.username;
    }
    connect();
} catch (e){
    localStorage.removeItem("tu")
    //console.error(e)
}


function publish() {
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
}

function subscribe(top) {
    client.subscribe((top || topic.value), function (err) {
        if (err) {
            message.value += err;
        }
    })
}

function mes(topic, msg) { return;
    //msg = JSON.parse(msg);
    var topicdiv = document.getElementById(topic);
    if(!topicdiv){
        topicdiv = $('<div class="topic " style="max-height: 40vh" id='+topic+'><header>'+topic+'</header></div>');
        $(message).append(topicdiv)
    }
    if(msg.client)
        topicdiv.innerHTML += '<br>' + msg.client + ' : ' + msg.payload;
    else
        topicdiv.innerHTML += '<br>' + msg;
    topicdiv.scrollTop = topicdiv.scrollHeight;
    message.scrollTop = message.scrollHeight;
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

payload.onkeyup = function (e) {
    if (e.keyCode == 13) {
        publish();
        this.value = ''
    }
};

topic.onkeyup = function (e) {
    if (e.keyCode == 13) {
        subscribe();
    }
}

// user.onkeyup = function (e) {
//     if (e.keyCode == 13) {
//         connect();
//     }
// }
