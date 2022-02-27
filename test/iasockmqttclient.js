/*

var username = "vv";
var password = username + "IA";
var brokerUrl = 'mqtt://localhost:3001';
var client = {};

function connect() {
    username = user.value;
    password = username + "IA";

    var tu = {
        username: username,
        password: password,
        clientId: username + '---',
        clean: true,//false
//            resubscribe: true
    };

    client = mqtt.connect(brokerUrl, tu);

    client.on('connect', function () {
        localStorage.setItem("tu", JSON.stringify(tu));
        $(user).addClass("green");
        subscribe('admin/publishes');
    });

    client.on('message', function (topic, message, packet) {
        // message is Buffer
        console.log(packet, message.toString());

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
        connect();
    }
} catch (e){
    localStorage.removeItem("tu")
    console.error(e)
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

function mes(topic, msg) {
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

function log(topic, msg) {
    try {
        msg = JSON.parse(msg.toString());
        var logdiv = document.getElementById('adminlog');
        logdiv.innerHTML += '<div class="log">' +
            '<div class="sender">' + msg.sender + ' => ' + msg.topic + '</div>' +
            '<div class="payload" title="' + msg.time + '">' + msg.payload + '</div>' +
            '</div>';
        logdiv.scrollTop = logdiv.scrollHeight;
        message.scrollTop = message.scrollHeight;
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

user.onkeyup = function (e) {
    if (e.keyCode == 13) {
        connect();
    }
}
*/
