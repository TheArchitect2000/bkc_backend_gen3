/*$(document).ajaxComplete(function (t) {
    $('.count-to').countTo();
});*/

var timezones = ["Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Godthab",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Kralendijk",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Lower_Princes",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Marigot",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montserrat",
    "America/Nassau",
    "America/New_York",
    "America/Nipigon",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Ojinaga",
    "America/Panama",
    "America/Pangnirtung",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Barthelemy",
    "America/St_Johns",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Thunder_Bay",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "America/Yellowknife",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Arctic/Longyearbyen",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom_Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qostanay",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/St_Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Bratislava",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Busingen",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle_of_Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kiev",
    "Europe/Kirov",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Mariehamn",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Podgorica",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/San_Marino",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Uzhgorod",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zaporozhye",
    "Europe/Zurich",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Enderbury",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis"];

var devicetemps = {
    /*"MOTION_DETECTOR": {
        "active": true,
        "type": "SENSOR",
        "icon": "device-motion-detector",
        "color": "bg-cyan",
        "data": {
            "state": {
                "type": "String",
                "enum": ["Detected", "NoOne"],
                "values": {
                    'data-value="NoOne"': {
                        "style": "color:lime"
                    },
                    'data-value="Detected"': {
                        "style": "color:red"
                    }
                }
            },
            "battery": {
                "type": "Number",
                "iconclass": "mdi mdi-battery"
            }
        },
        "title": "motion detector",
        "Blockly": {
            "Block": {
                init: function() {
                    this.jsonInit({
                        "message0": 'Motion Detector %1 \n sends %2',
                        "args0": [
                            {
                                "type": "field_variable",
                                "name": "DEVICE",
                                "variable": "x"
                            },
                            {
                                "type": "field_dropdown",
                                "name": "STATE",
                                "check": "String",
                                "options": [
                                    ["Detected", "Detected"],
                                    ["not Detected", "NoOne"],
                                ]
                            },

                        ],
                        "output": "Boolean",
                        "colour": 100,
//                "tooltip": "Returns number of letters in the provided text.",
//                "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
                    });
                }
            },
            "JavaScript":  function(block) {
                // String or array length.
                var device = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('DEVICE'), Blockly.Variables.NAME_TYPE);
                var state = block.getFieldValue('STATE');
                var code = device +'.PAYLOAD.state === \''+ state+'\'';
                return [code, Blockly.JavaScript.ORDER_MEMBER];
            }
        }
    },*/
    /*"DOOR_SENSOR": {
        "active": true,
        "type": "SENSOR",
        "icon": "device-door-sensor",
        "color": "bg-brown",
        "data": {
            "state": {
                "type": "String",
                "enum": ["CLOSED", "OPEN", "LOCKED"],
                "values": {
                    'data-value="CLOSED"': {
                        "style": "color:#2fd12d"
                    },
                    'data-value="OPEN"': {
                        "style": "color:red"
                    },
                    'data-value="LOCKED"': {
                        "style": "color:navy"
                    }

                }
            },
            "battery": {
                "type": "Number",
                "iconclass": "mdi mdi-battery",
                "values1": {
                    'data-value': {
                        "style": "color:green"
                    },
                    'data-value="9"': {
                        "style": "color:red"
                    },
                    'data-value="8"': {
                        "style": "color:red"
                    },
                    'data-value="7"': {
                        "style": "color:red"
                    },
                    'data-value="6"': {
                        "style": "color:red"
                    },
                    'data-value="5"': {
                        "style": "color:red"
                    },
                    'data-value="4"': {
                        "style": "color:red"
                    },
                    'data-value^="3"': {
                        "style": "color:orange"
                    },
                    'data-value="3"': {
                        "style": "color:red"
                    },
                    'data-value^="2"': {
                        "style": "color:orange"
                    },
                    'data-value="2"': {
                        "style": "color:red"
                    },
                    'data-value^="1"': {
                        "style": "color:red"
                    },
                    'data-value="100"': {
                        "style": "color:green"
                    }
                }
            }
        },
        "title": "door sensor"
    },*/
    /*"IA_SHORTCUT": {
        "active": true,
        "type": "SENSOR",
        "icon": "device-ia-shortcut",
        "color": "bg-cyan",
        "data": {
            "state": {
                "type": "String",
                "enum": ["pressed", "double", "hold"],
                "values": {
                    'data-value="pressed"': {
                        "style": "color:#2fd12d"
                    },
                    'data-value="double"': {
                        "style": "color:#2fd12d"
                    },
                    'data-value="hold"': {
                        "style": "color:#2fd12d"
                    }
                }
            },
            "battery": {"type": "Number", "iconclass": "mdi mdi-battery"}
        },
        "title": "IA Shortcut"
    },*/
    /*"SMART_BUTTON": {
        "active": true,
        "type": "SENSOR",
        "icon": "device-ia-shortcut",
        "color": "bg-cyan",
        "data": {
            "state": {
                "type": "String",
                "enum": ["pressed", "double", "hold"],
                "values": {
                    'data-value="pressed"': {
                        "style": "color:#2fd12d"
                    },
                    'data-value="double"': {
                        "style": "color:#2fd12d"
                    },
                    'data-value="hold"': {
                        "style": "color:#2fd12d"
                    }
                }
            },
            "battery": {"type": "Number", "iconclass": "mdi mdi-battery"}
        },
        "title": "IA Smart Button"
    },*/
    /*"POWER_PLUG": {
        "active": true,
        "type": "ACTUATOR",
        "icon": "device-power-plug",
        "color": "bg-deep-orange",
        "data": {
            "state": {"type": "String", "enum": ["ON", "OFF"]} ,
            "current": {"type": "Number", "iconclass": "mdi mdi-current-ac"}
            },
        "commands": [
            {"command": "TURN_OFF", "title": "Off", "state": "OFF"},
            {"command": "TURN_ON", "title": "On", "state": "ON"}
            ],
        "commandsoptions": {
            "type": "switch"  //enum: button, radio, switch, check
        },
        "title": "power plug"
    },*/
    /*"IA_SPEAKER": {
        "active": true,
        "type": "ACTUATOR",
        "icon": "device-ia-speaker",
        "color": "bg-deep-purple",
        "data": {
            "state": {"type": "String", "enum": ["OFF", "IDLE", "PLAYING", "PAUSED"]},
            "volume": {"type": "Number", "iconclass": "mdi mdi-volume-medium"},
            "file-name": {"type": "String"},
            "file-url": {"type": "String"}
        },
        "commands": [
            {"command": "SILENT", "payload":{"silent":true}},
            {"command": "NO-SILENT", "payload":{"silent":false}},
            {"command": "VOLUME_TO", "payload":{"volume":70}},
            {"command": "VOLUME_UP", "payload":{"volume": 90}},
            {"command": "VOLUME_DOWN", "payload":{"volume": 30}},
            {"command": "TURN_OFF", "title": "Off",  "payload":{"state": "OFF"}},
            {"command": "TURN_ON", "title": "On",  "payload":{"state": "ON"}},
            {"command": "PAUSE", "payload":{ "state": "PAUSED"}},
            {"command": "STOP", "payload":{ "state": "IDLE"}},
            {"command": "PLAY",
                "file-name": {"type": "String"},
                "file-url": {"type": "String"},
                "file-extension": {"type": "String"},
                "file-save": {"type": "String"},
                "volume": {"type": "Number"},
                "play-time": {"type": "String", "enum": ["IMMEDIATE", "NEXT", "LAST", "END"] , "default":"IMMEDIATE"},

                "payload":{ "state": "PLAYING", "volume":40, "filename":"a328b343243d3", "file-url":"https://iabroker..../a328b343243d3"},
            }
        ],
        "commandsoptions": {
            "type": "voice"  //enum:voice, button, radio, switch, check
        },
        "title": "IA-Speaker"
    },*/
    /*"LIGHT_SWITCH": {
        "active": false,
        "type": "ACTUATOR",
        "data": {"state": {"type": "String", "enum": ["ON", "OFF"]}},
        "commands": [{"command": "TURN_OFF", "title": "Off", "state": "OFF"}, {"command": "TURN_ON", "title": "On", "state": "ON"}],
        "commandsoptions": {
            "type": "switch"  //enum: button, radio, switch, check
        },
        "icon": "device-light-switch",
        "color": "bg-yellow",
        "title": "light-switch"
    },*/
    /*"SMART_IRRIGATION": {
        "active": false,
        "type": "ACTUATOR",
        "icon": "mdi mdi-water-pump",
        "color": "bg-blue",
        "data": {"state": {"type": "String", "enum": ["ON", "OFF"]}},
        "commands": [{"command": "START"}, {"command": "STOP"}],
        "title": "smart irrigation"
    },*/
    /*"DEVICETYPE_OD47Q": {
        "active": true,
        "type": "ACTUATOR",
        "icon": "device-OD47Q",
        "color": "bg-deep-orange",
        "data": {
            "state": {"type": "String", "enum": ["ON", "OFF"]} ,
            "state2": {"type": "String", "enum": ["ON", "OFF"]} ,
            "current": {"type": "Number", "iconclass": "mdi mdi-current-ac"},
            "current2": {"type": "Number", "iconclass": "mdi mdi-current-ac"}
        },
        "commands": [
            {"command": "TURN_OFF", "title": "Off", "state": "OFF"},
            {"command": "TURN_ON", "title": "On", "state": "ON"},
            {"command": "TURN_OFF2", "title": "Off", "state2": "OFF"},
            {"command": "TURN_ON2", "title": "On", "state2": "ON"}
        ],
        "commandsoptions": {
            // "type": "none",  //enum: button, radio, switch, check
        },
        "controllers": [
            {
                "type": "switch",
                "title": "<b>A</b> <span class='mdi mdi-current-ac' data='current' ssbind='text:getmyval(devices[ssIndex]._encid,`current`)||`&nbsp;` ; data-value:getmyval(devices[ssIndex]._encid,`current`)' sslevel='controller'></span> off",
                "title2": "on",
                "data": "state",
                "ondata": "ON",
                "commands": {
                    "on": "TURN_ON",
                    "off": "TURN_OFF"
                }
            },
            {
                "type": "switch",
                "title": "<b>B</b> <span class='mdi mdi-current-ac' data='current2'></span> off",
                "title2": "on",
                "data": "state2",
                "ondata": "ON",
                "commands": {
                    "on": "TURN_ON2",
                    "off": "TURN_OFF2"
                }
            }
        ],
        "title": "MECO power plug",
        "vendor": "Mapna Group"
    },*/
    /*"THERMOMETER": {
     "active": false,
     "type": "SENSOR",
     "icon": "mdi mdi-thermometer",
     "color": "bg-amber",
     "data": {"temperature": {"type": "Number"}, "battery": {"type": "Number", "iconclass": "mdi mdi-battery"}},
     "title": "thermometer"
     },*/
    /*"SMOKE_DETECTOR": {
        "active": false,
        "type": "SENSOR",
        "icon": "mdi mdi-smoking",
        "color": "bg-blue-grey",
        "title": "smoke detector"
    }*/
};

//load devicetypes and set value devicetemps
$.get('/iadevicetype' , function (devtypes) {
    for (var devt of devtypes) {
        var devtemp = {
            "active": devt.Active,
            "type": devt.Type,
            "icon": devt.Icon,
            // "color": "bg-cyan",
            "title": devt.DeviceName,
            "blockly": devt.Blockly,
            "vendor": devt._Vendor,
            "OTA": devt.OTA,
        };
        if(devt.Controllers){
            try {
                devtemp.controllers = JSON.parse(devt.Controllers)
            }catch (e){

            }
        }
        devtemp.data = {};
        for (var d of devt.Data) {
            devtemp.data[d.Name] = {
                "type": d.Type,
                "enum": d.Enum,
                "unit": d.Unit,
                "isOption": d.isOption,
                "iconclass": d.iconclass,
            }
        }
        devtemp.commands = [];
        for (var c of devt.Commands) {
            devtemp.commands.push({"command": c.Command, "title": c.Title, "state": c.State});
        }

        if (devt.CommandType && devt.CommandType !== 'none') {
            devtemp.commandsoptions = {
                type: devt.CommandType
            }
        }

        devicetemps[devt.DeviceType] = devtemp;
    }


    //add option to POWER_PLUG
    // devicetemps['POWER_PLUG'].data["option_savestate"] = {"type": "BOOLEAN", "default": false,"title": "Keep Last State", "isOption": true}
/*
    devicetemps['POWER_PLUG'].controllers = [
        {
            "type": "switch",
            "title": "<span class='mdi mdi-current-ac' data='current' ssbind='text:getmyval(devices[ssIndex]._encid,`current`)||`&nbsp;` ; data-value:getmyval(devices[ssIndex]._encid,`current`)' sslevel='controller'></span> Off",
            "title2": "On",
            "data": "state",
            "ondata": "ON",
            "commands": {
                "on": "TURN_ON",
                "off": "TURN_OFF"
            }
        },
        {
            "type": "check",
            "title": "<b>ss</b> <span class='mdi mdi-current-ac' data='current' ssbind='text:getmyval(devices[ssIndex]._encid,`current`)||`&nbsp;` ; data-value:getmyval(devices[ssIndex]._encid,`current`)' sslevel='controller'></span> No",
            "title2": "on",
            "data": "savestate",
            "ondata": "ON",
            "commands": {
                "on": "TURN_ON",
                "off": "TURN_OFF"
            }
        }
    ]*/

    //todo remove by implementing ShowExtra
    // devicetemps['COOLING_TOWER'].ShowExtra = true;
})

function updateDeviceTypes(after, forvendor) {
    if(!vendor) return;
    var url = '/iadevicetype/';
    if(forvendor) url += 'vendor/'+vendor._id;
    $.getJSON(url, function (_devicetypes) {
        devicetypes = _devicetypes;
        //home._devices = _devicetypes;
        //update localStorage by _lastState of each device
        for(var dev of devicetypes){
            //devicetemps
        }
        if(after) after();
    })
}

var vartypes = [ "STRING", "NUMBER", "DATE", "TIME", "BOOLEAN"];

var commandtypes = ["none","switch", "button", "radio", "switch", "check", "voice"];

var ServiceCategories = ["Automation", "Lighting", "Security", "Entertainment"];

var DeviceType_Types = ["SENSOR", "ACTUATOR"];

var home_accesses = [
    "HOME.NAME",
    "HOME.DEVICES.LIST",
    "HOME.ALERTS",
    "NOTIFICATION"
];

{
    var defaulticon = "data:image/jpeg;base64,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UGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQABAEgAAAABAAE4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSQAAAAYAAAAAAAAAAAAAASwAAAEsAAAACgBVAG4AdABpAHQAbABlAGQALQAxAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAEsAAABLAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAABLAAAAABS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QWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTEwLTEzVDEyOjEyOjI2KzAzOjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTEwLTEzVDEyOjEyOjI2KzAzOjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0xMC0xM1QxMjoxMjoyNiswMzozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjYzgyNzRkMi1iNTcwLTk5NDctYTViOS0xZWQ2NTc5YWQyZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4ZjQyYWM0MS1hOGU4LTUxNDAtOTU1ZC0xN2I2YjIyNzRhZmYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZTY0NDc2Ny0yNjg5LTc3NDYtYTIyOS05OTkzOWU3MzhkNDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZTY0NDc2Ny0yNjg5LTc3NDYtYTIyOS05OTkzOWU3MzhkNDAiIHN0RXZ0OndoZW49IjIwMjEtMTAtMTNUMTI6MTI6MjYrMDM6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2M4Mjc0ZDItYjU3MC05OTQ3LWE1YjktMWVkNjU3OWFkMmVjIiBzdEV2dDp3aGVuPSIyMDIxLTEwLTEzVDEyOjEyOjI2KzAzOjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAOQWRvYmUAZAAAAAAB/9sAhAAKBwcHCAcKCAgKDwoICg8SDQoKDRIUEBASEBAUEQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQsMDBUTFSIYGCIUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAEsASwDAREAAhEBAxEB/90ABAAm/8QBogAAAAcBAQEBAQAAAAAAAAAABAUDAgYBAAcICQoLAQACAgMBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgsQAAIBAwMCBAIGBwMEAgYCcwECAxEEAAUhEjFBUQYTYSJxgRQykaEHFbFCI8FS0eEzFmLwJHKC8SVDNFOSorJjc8I1RCeTo7M2F1RkdMPS4ggmgwkKGBmElEVGpLRW01UoGvLj88TU5PRldYWVpbXF1eX1ZnaGlqa2xtbm9jdHV2d3h5ent8fX5/c4SFhoeIiYqLjI2Oj4KTlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+hEAAgIBAgMFBQQFBgQIAwNtAQACEQMEIRIxQQVRE2EiBnGBkTKhsfAUwdHhI0IVUmJy8TMkNEOCFpJTJaJjssIHc9I14kSDF1STCAkKGBkmNkUaJ2R0VTfyo7PDKCnT4/OElKS0xNTk9GV1hZWltcXV5fVGVmZ2hpamtsbW5vZHV2d3h5ent8fX5/c4SFhoeIiYqLjI2Oj4OUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6/9oADAMBAAIRAxEAPwDs2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Ds2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Hs2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Ls2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Ps2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Ts2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxVAXmr2tqSoPqyjqinp/rNiqraahbXY/dtR+8bbMMVRWKuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV//9Xs2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxVD3V9bWi1lb4uyDdj9GKpBe6zc3NUj/dReA+0f9ZsVS7FW1YqQykgjcEbHFU2steljol0PUT+cfaHz/mxVPYLiG4TnC4dfbt88VVMVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdir/AP/W7NirsVdirsVdirsVdirsVdirsVdirsVdirsVWSzRQoXlYIg7nFUkvdeZqpaDiP8Afrdf9iuKpO7u7FnYsx6sdycVVrWyubtqQpUd3Oyj6cVT6z0W2twGlAml8WHwj5Liqje6DHJV7U+m/wDvs/ZPy/lxVI5oJoH4TIUbwP8ADFXQzzQOHhco3iP44qnllr0b0S6Hpv8A78H2T8/5cVTdWVgGUgqdwRuMVbxV2KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2Kv//X7NirsVdirsVdirsVdirsVdirsVdirsVaJAFTsB1OKpVe67DFVLcCWT+b9gf81Yqkdxcz3L85nLHt4D5DFVkUUszhIlLuegGKp3ZaCq0e7PI/76Xp/smxVOEREUIihVHRQKDFV2KuxVTnt4Z04TIHXwP8MVSO90GSOr2p9RP5D9ofL+bFUoZWUlWBDDYg7HFUTaahc2h/dNVO8bbqcVT+y1e2uqKT6Up/Ybof9VsVR+KuxV2KuxV2KuxV2KuxV2KuxV2KuxV2Kv8A/9Ds2KuxV2KuxV2KuxV2KuxV2KuxV2KoK91S2tKqTzl/32vX/ZH9nFUgvNSubs0duMfaNdh9P82KoQAk0G5PQYqmlloc01HuKxR/y/tn/mnFU9t7WC2ThCgUdz3PzOKq2KuxV2KuxV2KuxVC3en212P3i0ftIuzDFUgvdIubWrAepCP217f6y4qgMVTGy1m5t6JJ+9i8D9of6rYqn9re212tYXqe6HZh8xiqIxV2KuxV2KuxV2KuxV2KuxV2KuxV/9Hs2KuxV2KuxV2KuxV2KuxV2KqFzd29qnKZwvgO5+QxVIr3W556pB+6i8R9o/T+z/scVSzFUZZaXdXdGUcIv9+N0/2P82Kp/Z6ZbWgBReUveRuv0fy4qjMVdirsVdirsVdirsVdirsVdiqW3ui29xV4v3UviPsn5riqQ3Vlc2rcZkoOzjdT8jiqijujB0Yqw6MDQ4qnFlrzLRLsch/v1ev+yXFU7ilimQPEwdD0IxVfirsVdirsVdirsVdirsVdir//0uzYq7FXYq7FXYq7FXYq7FUNqM0kFlLLGaOoFD16kDFWJySSSuXkYu56k7nFV9taXFy/CFC3iew+ZxVPrLQ4IaPPSWTw/ZH0ftYqmfTYYq3irsVdirsVdirsVdirsVdirsVdirsVWuiOpR1DKeqkVGKpPe6Cpq9oaH/fTdP9i2KpJLFJC5SVSjjqDiq+3up7Z+cLlT3HY/MYqzBTVQT3FcVXYq7FXYq7FXYq7FXYq7FX/9Ps2KuxV2KuxV2KuxV2KuxVBav/AMc6f5D/AIkMVYpirL9OVVsYOIAqik08SOuKonFXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYqlevqpsgxA5BxQ9964qxvFWbJ9hfkMVXYq7FXYq7FXYq7FXYq7FX/9Ts2KuxV2KuxV2KuxVKtQ1h7S49ERBxQGpNOv0Yqhv8Ryf74H/BH+mKqN3rb3Nu8BiCh6fFWvQ18MVSvFWYWH+8Nv8A8Y1/ViqH1PUmsfS4xh/U5dTSlKf81YqhbfzCryqs0YSM7Fwa0/DFU5BBAINQdwRiqnc3MVtEZZTRR0HcnwGKpOfMbdrcU/1v+bcVd/iNv+Wcf8F/zbirv8Rt/wAs4/4L/m3FXf4jb/lnH/Bf824q7/Ebf8s4/wCC/wCbcVa/xG//ACzj/gv+bcVd/iN/98D/AIL/AJtxV3+I3/3wP+C/5txV3+I3/wB8D/gv+bcVd/iN/wDfA/4L/m3FXf4jf/fA/wCC/wCbcVd/iN/98D/gj/TFUPe6u15D6LRBRUNUHw+jFUv+HwP3/wBmKpuPMUgAHoDbb7R/pirf+I5P98D/AII/0xVOLWYz28cxHEuK08MVVsVdirsVdirsVdir/9Xs2KuxV2KuxV2KuxVjOvf73n/UXFUBFFJK/CJS79eI3OKqklldxoXkhZUHViNsVUMVZhp/+8Nv/wAY1/ViqX69bTzmD0Y2fjz5cRWleOKpAysrFWBDA0IPUHFUz0zVzbD0Z6tD+yRuVPh/q4qhL6+lvJeb7IPsJ2AxVSigmmYrEjORuQoriqr+jr7/AJZ3/wCBOKu/R19/yzv/AMCcVd+jr7/lnf7jirv0df8A/LO/3Yq09jeRoXeF1RdyxGwxVD4qiEsbyRQ6QuytuCBscVb/AEdf/wDLO/3Yq79HX/8Ayzv92Ku/R1//AMs7/dirv0df/wDLO/3Yq79HX/8Ayzv92Ku/R1//AMs7/dirT2N5Ghd4XVF3LEbDFUPirLtM/wB4IP8AUGKorFXYq7FXYq7FXYq//9bs2KuxV2KuxV2KuxVjOvf73n/UXFWtC/46C/6rfqxVOtX/AOOdP8h/xIYqxTFWYWH+8Nv/AMY1/ViqIxVLNV0sXSmaIUuAPoYeB/ysVY2ylSVYUYbEHqDiqta2st1MIohv+03YDxOKsps7OK0iEcY36sx6k4qiMVdirsVdiqE1T/jnz/6v8cVYlirLtM/3gg/1BiqKxV2KuxV2KuxV2KoTVP8Ajnz/AOr/ABxViWKsu0z/AHgg/wBQYqisVdirsVdirsVdir//1+zYq7FXYq7FXYq7FWM69/vef9RcVa0L/joL/qt+rFU61f8A450/yH/EhirFMVZhYf7w2/8AxjX9WKojFXYqlup6St2RLEQk2wYnoR7/AOUMVRVnZxWkQjjG/V3PUnFURirsVdirsVdiqUa1qEaRNaJ8Urij+Cj/AJqxVj2Ksu03/eCD/UGKorFXYq7FXYq7FXYqhNU/458/+r/HFWJYqy7TP94IP9QYqisVdirsVdirsVdir//Q7NirsVdirsVdirsVYzr3+95/1FxVrQv+Ogv+q36sVTrV/wDjnT/If8SGKsUxVmFh/vDb/wDGNf1YqiMVdirsVdirsVdirsVdiqV6rqotgYYTWc9T2Uf81YqxwksSzGpO5J61xVNdJ0kzEXFwKQjdEP7X/NmKshAAFBsBireKuxV2KuxV2KuxVCap/wAc+f8A1f44qxLFWXaZ/vBB/qDFUVirsVdirsVdirsVf//R7NirsVdirsVdirsVYzr3+95/1FxVrQv+Ogv+q36sVTrV/wDjnT/If8SGKsUxVmFh/vDb/wDGNf1YqiMVdirsVdirsVdirsVQepzXEFoz268m7t/KP5qYqxQksSzGpO5J61xVG6TBbT3QW4bpuiHox8MVZSAAKDYDFW8VdirsVdirsVdirsVQmqf8c+f/AFf44qxLFWXaZ/vBB/qDFUVirsVdirsVdirsVf/S7NirsVdirsVdirsVYzr3+95/1FxVrQv+Ogv+q36sVTrV/wDjnT/If8SGKsUxVmFh/vDb/wDGNf1YqiMVdirsVdirsVdirsVaxVINW0n063NsP3fWSMfs/wCUv+TiqUAkGo2I6HFWQ6TqwnAgnNJh9lv5v+b8VTbFXYq7FXYq7FXYq7FUJqn/ABz5/wDV/jirEsVZdpn+8EH+oMVRWKuxV2KuxV2KuxV//9Ps2KuxV2KuxV2KuxVjOvf73n/UXFWtC/46C/6rfqxVOtX/AOOdP8h/xIYqxTFWYWH+8Nv/AMY1/ViqIxV2KuxV2KuxV2KuxV2KtYqkGr6V6Vbm3H7rrIg/Z91/ycVSgEggg0I6HFWX2Ejy2cMjmrsoJPjiqIxV2KuxV2KuxV2KoTVP+OfP/q/xxViWKsu0z/eCD/UGKorFXYq7FXYq7FXYq//U7NirsVdirsVdirsVYzr3+95/1FxVrQv+Ogv+q36sVTrV/wDjnT/If8SGKsUxVmFh/vDb/wDGNf1YqiMVdirsVdirsVdirsVdirsVQmqf8c+f/VxViWKsu0z/AHgg/wBQYqisVdirsVdirsVdiqE1T/jnz/6v8cVYlirLtM/3gg/1BiqKxV2KuxV2KuxV2Kv/1ezYq7FXYq7FXYq7FWM69/vef9RcVQlpdPaTCZAGYAijdN/liqKudauLmB4XRAr0qRWuxr44ql2KswsP94bf/jGv6sVQ2q6jLZel6aq3qcq8q9uPgf8AKxVB2/mFzKBcRqIjsWWtR77k4qnisrqGUgqRUEdCMVUbu7itIjJIfZVHUnwGKpKfMV12ijp9P9cVa/xFdf77j/4b/mrFXf4iuv8Afcf/AA3/ADVirv8AEV1/vuP/AIb/AJqxV3+Irr/fcf8Aw3/NWKqdxrdxPC8LRoFcUJFa/rxVLcVTKDXLmCFIVjQqgoCa1/Xiqp/iK6/33H/w3/NWKu/xFdf77j/4b/mrFXf4iuv99x/8N/zVirv8RXX++4/+G/5qxV3+Irr/AH3H/wAN/wA1Yq7/ABFdf77j/wCG/wCasVU7jW7i4heFo0CuKEitf14qluKsu0z/AHgg/wBQYqisVdirsVdirsVdir//1uzYq7FXYq7FXYq7FUi1fT7y4vDJDGWTiBWoG4+ZxVA/ojUf98H71/riqyXTb2GMySRFUXqaj5djiqFxVmGn/wC8Nv8A8Y1/ViqB1yzubkwegnPjy5bgUrxp1+WKsfdHjco4KupoQeoOKo/TdWe0BjkBeHche4PtiqFu7uW7lMsp/wBVewHgMVat7W4uSRAhcruabU+/FVf9Eaj/AL4P3r/XFXfojUf98H71/rirv0RqP++D96/1xV36I1H/AHwfvX+uKu/RGo/74P3r/XFXfojUf98H71/rirv0RqP++D96/wBcVd+iNR/3wfvX+uKu/RGo/wC+D96/1xV36I1H/fB+9f64q79Eaj/vg/ev9cVU59PvIE9SaPglaVJHX6DiqHof8ziqMGk6iRUQmh91/rirv0RqP++D96/1xVkdjG8VnDHIOLqoDD3xVEYq7FXYq7FXYq7FX//X7NirsVdirsVdirsVdirsVQWr/wDHOn+Q/wCJDFWKYqzCw/3ht/8AjGv6sVRGKpfqemJdpzSi3CjY9mH8rYqxl0eNyjgq6mhB6g4qr2VlLeS8E2UfbfsBirKba2itohFEKKOp7k+JxVWxV2KuxV2KuxV2KuxV2KuxV2KuxVLNf/3g/wBmv8cVY1irNk+wvyGKrsVdirsVdirsVdirsVdir//Q7NirsVdirsVdirsVdirsVQerKzafMFBJoNhv0IxVieKphZavc2tEb95CP2D1A/yWxVP7S/trtaxN8fdDsw+jFUTiqA1HS4ryjA8Jhtzp1Hg2Kom2toraIRRCijqe5PicVVsVdirsVdirsVdirsVdirsVdirsVQF7q1ta1UH1Jh+wvb/Wb9nFUgvNQubs/vGog3EY2UYqhgCxAAqT0AxVmqbIvyGKrsVdirsVdirsVdirsVdir//R7NirsVdirsVdirsVdirsVdiqX3uj21zV1/dSn9peh/1lxVILuwubRqSr8PZxup+nFUOrMrBlJVhuCNiMVTey16RKJdDmv+/B9of6w/axVPIZ4p0EkTh1PcYqqYq7FXYq7FXYq7FXYq7FXYq7FUPdXtvarymeh7KN2PyGKpDe61cXFUi/dReA+0fm2KpbiqOstJubqjU9OI/tt3/1V/axVkFnp1taD92tZO8jbt/zbiqKxV2KuxV2KuxV2KuxV2KuxV//0uzYq7FXYq7FXYq7FXYq7FXYq7FWmVXUqwDKdiDuDiqT3ugo9XtTwb/fZ+yf9U/s4qkk0EsDmOVCjjscVbguJrd+cLlG9uh+YxVPLLXYpKJcj03/AJx9k/8ANOKpsCGAINQehGKt4q7FXYq7FXYq7FVksscSF5GCIOpO2KpLe6+TVLQUH+/WG/8AsV/5qxVJnd5GLuxZj1YmpxVVtbO4um4wpUd2Oyj5nFU/stFt7ejy/vZff7I+S4qmWKuxV2KuxV2KuxV2KuxV2KuxV2Kv/9Ps2KuxV2KuxV2KuxV2KuxV2KuxV2KuxVSnt4bhOEyB17V6j5HFUjvdCljq9sfUT+Q/aH/NWKpSQQSCKEdQcVRVnqNzaH921Y+8bbr/AM24qn9lq1tdUWvpyn9hu/8Aqt+1iqOxV2KuxVokAVPTFUrvdcghqkFJZPH9gfT+1iqRXF1Pcvzmcsew7D5DFVkcUkrhI1LuegG+Kp1ZaABR7s1P++lP/Em/5pxVOUjSNQiKFUdFAoMVXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FX/1OzYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FUJeadbXYrItJO0i7N/zdiqQXuk3NrVqepF/Ovb/AFh+ziqBxVMrLWri3okv72L3+0Pk2Kp/a3lvdLyhep7qdmHzGKqV5qdtaAhjzl7Rr1/2X8uKsfvNUubskMeEXaNen+y/mxVCddh1xVM7LQ55qPPWKPw/bP0fs4qn1taW9snCFAo7nufmcVVsVdirsVdirsVdirsVdirsVdirsVdirsVdir//1ezYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FUsvdEt56vD+5l9vsn5riqQ3VncWrcZkp4MN1PyOKqSO6MGRirDoQaHFWiSTU7k4qi7PTLq7IKrxi7yN0+j+bFU/stLtbSjKOcv+/G6/wCx/lxVG4q7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FXYq7FX//W7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdiq140kUpIoZD1UioxVJrzQASXtGp/xWx2/2LYqrWWhww0e4pLJ/L+wP+asVTQAAUGwHQYq3irsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdir/AP/X7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//Q7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//R7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//S7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//T7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//U7NirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVdirsVf//Z";
}


var sheet = document.styleSheets[0];

for (var dt in devicetemps) {
    var devicetemp = devicetemps[dt];
    if (devicetemp.data) {
        for (var d in devicetemp.data) {
            var dd = devicetemp.data[d];
            if (dd.values) {
                for (var v in dd.values) {
                    var val = dd.values[v];
                    var selector = `[device="${dt}"] [data="${d}"][${v}]`;
                    console.debug(selector + ' {' + val.style+'}')
                    sheet.addRule(selector, val.style)
                }
            }
        }

    }
}

var radio_countries = [{"name":"Afghanistan","stationcount":213},{"name":"Albania","stationcount":25},{"name":"Algeria","stationcount":78},{"name":"American Samoa","stationcount":3},{"name":"Andorra","stationcount":5},{"name":"Angola","stationcount":10},{"name":"Anguilla","stationcount":1},{"name":"Antarctica","stationcount":1},{"name":"Antigua And Barbuda","stationcount":4},{"name":"Argentina","stationcount":325},{"name":"Armenia","stationcount":28},{"name":"Aruba","stationcount":8},{"name":"Ascension And Tristan Da Cunha Saint Helena","stationcount":1},{"name":"Australia","stationcount":300},{"name":"Austria","stationcount":207},{"name":"Azerbaijan","stationcount":10},{"name":"Bahrain","stationcount":1},{"name":"Bangladesh","stationcount":15},{"name":"Barbados","stationcount":6},{"name":"Belarus","stationcount":53},{"name":"Belgium","stationcount":240},{"name":"Belize","stationcount":1},{"name":"Benin","stationcount":2},{"name":"Bermuda","stationcount":5},{"name":"Bolivarian Republic Of Venezuela","stationcount":21},{"name":"Bolivia","stationcount":26},{"name":"Bonaire","stationcount":5},{"name":"Bosnia And Herzegovina","stationcount":40},{"name":"Botswana","stationcount":6},{"name":"Brazil","stationcount":556},{"name":"British Indian Ocean Territory","stationcount":2},{"name":"Brunei Darussalam","stationcount":3},{"name":"Bulgaria","stationcount":107},{"name":"Burkina Faso","stationcount":2},{"name":"Burundi","stationcount":1},{"name":"Cabo Verde","stationcount":10},{"name":"Cambodia","stationcount":10},{"name":"Cameroon","stationcount":1},{"name":"Canada","stationcount":891},{"name":"Chile","stationcount":146},{"name":"China","stationcount":1980},{"name":"Christmas Island","stationcount":1},{"name":"Colombia","stationcount":145},{"name":"Costa Rica","stationcount":39},{"name":"Coted Ivoire","stationcount":5},{"name":"Croatia","stationcount":177},{"name":"Cuba","stationcount":41},{"name":"Curacao","stationcount":7},{"name":"Cyprus","stationcount":36},{"name":"Czechia","stationcount":225},{"name":"Denmark","stationcount":80},{"name":"Dominica","stationcount":1},{"name":"Dutch Part Sint Maarten","stationcount":1},{"name":"Ecuador","stationcount":136},{"name":"Egypt","stationcount":25},{"name":"El Salvador","stationcount":14},{"name":"Estonia","stationcount":43},{"name":"Eswatini","stationcount":2},{"name":"Ethiopia","stationcount":6},{"name":"Fiji","stationcount":7},{"name":"Finland","stationcount":121},{"name":"France","stationcount":1754},{"name":"French Guiana","stationcount":4},{"name":"Gabon","stationcount":1},{"name":"Georgia","stationcount":21},{"name":"Germany","stationcount":3052},{"name":"Ghana","stationcount":9},{"name":"Gibraltar","stationcount":3},{"name":"Greece","stationcount":297},{"name":"Greenland","stationcount":6},{"name":"Grenada","stationcount":4},{"name":"Guadeloupe","stationcount":4},{"name":"Guam","stationcount":3},{"name":"Guatemala","stationcount":28},{"name":"Guinea","stationcount":7},{"name":"Guinea Bissau","stationcount":1},{"name":"Guyana","stationcount":2},{"name":"Haiti","stationcount":7},{"name":"Honduras","stationcount":21},{"name":"Hong Kong","stationcount":16},{"name":"Hungary","stationcount":226},{"name":"Iceland","stationcount":23},{"name":"India","stationcount":209},{"name":"Indonesia","stationcount":116},{"name":"Iraq","stationcount":6},{"name":"Ireland","stationcount":107},{"name":"Islamic Republic Of Iran","stationcount":23},{"name":"Isle Of Man","stationcount":5},{"name":"Israel","stationcount":115},{"name":"Italy","stationcount":1133},{"name":"Jamaica","stationcount":17},{"name":"Japan","stationcount":104},{"name":"Jersey","stationcount":1},{"name":"Jordan","stationcount":7},{"name":"Kazakhstan","stationcount":12},{"name":"Kenya","stationcount":26},{"name":"Kuwait","stationcount":12},{"name":"Kyrgyzstan","stationcount":2},{"name":"Latvia","stationcount":57},{"name":"Lebanon","stationcount":29},{"name":"Libya","stationcount":6},{"name":"Liechtenstein","stationcount":1},{"name":"Lithuania","stationcount":60},{"name":"Luxembourg","stationcount":21},{"name":"Macao","stationcount":1},{"name":"Madagascar","stationcount":13},{"name":"Malawi","stationcount":2},{"name":"Malaysia","stationcount":16},{"name":"Mali","stationcount":4},{"name":"Malta","stationcount":29},{"name":"Martinique","stationcount":5},{"name":"Mauritius","stationcount":2},{"name":"Mayotte","stationcount":6},{"name":"Mexico","stationcount":339},{"name":"Monaco","stationcount":5},{"name":"Mongolia","stationcount":6},{"name":"Montenegro","stationcount":7},{"name":"Morocco","stationcount":70},{"name":"Mozambique","stationcount":7},{"name":"Myanmar","stationcount":15},{"name":"Namibia","stationcount":8},{"name":"Nepal","stationcount":8},{"name":"New Caledonia","stationcount":3},{"name":"New Zealand","stationcount":72},{"name":"Nicaragua","stationcount":9},{"name":"Nigeria","stationcount":18},{"name":"Norway","stationcount":101},{"name":"Oman","stationcount":3},{"name":"Pakistan","stationcount":14},{"name":"Panama","stationcount":7},{"name":"Papua New Guinea","stationcount":4},{"name":"Paraguay","stationcount":17},{"name":"Peru","stationcount":171},{"name":"Poland","stationcount":768},{"name":"Portugal","stationcount":227},{"name":"Puerto Rico","stationcount":20},{"name":"Qatar","stationcount":6},{"name":"Republic Of North Macedonia","stationcount":7},{"name":"Reunion","stationcount":5},{"name":"Romania","stationcount":191},{"name":"Rwanda","stationcount":6},{"name":"Saint Kitts And Nevis","stationcount":1},{"name":"Saint Lucia","stationcount":7},{"name":"Saint Pierre And Miquelon","stationcount":1},{"name":"Saint Vincent And The Grenadines","stationcount":5},{"name":"San Marino","stationcount":7},{"name":"Saudi Arabia","stationcount":25},{"name":"Senegal","stationcount":8},{"name":"Serbia","stationcount":127},{"name":"Seychelles","stationcount":3},{"name":"Sierra Leone","stationcount":10},{"name":"Singapore","stationcount":30},{"name":"Slovakia","stationcount":92},{"name":"Slovenia","stationcount":56},{"name":"Solomon Islands","stationcount":1},{"name":"Somalia","stationcount":5},{"name":"South Africa","stationcount":50},{"name":"South Sudan","stationcount":1},{"name":"Spain","stationcount":622},{"name":"Sri Lanka","stationcount":30},{"name":"State Of Palestine","stationcount":3},{"name":"Suriname","stationcount":4},{"name":"Sweden","stationcount":110},{"name":"Switzerland","stationcount":461},{"name":"Syrian Arab Republic","stationcount":21},{"name":"Taiwan Province Of China","stationcount":22},{"name":"Tajikistan","stationcount":1},{"name":"Thailand","stationcount":75},{"name":"The Bahamas","stationcount":6},{"name":"The Cayman Islands","stationcount":4},{"name":"The Central African Republic","stationcount":2},{"name":"The Comoros","stationcount":5},{"name":"The Congo","stationcount":2},{"name":"The Cook Islands","stationcount":2},{"name":"The Democratic Peoples Republic Of Korea","stationcount":3},{"name":"The Democratic Republic Of The Congo","stationcount":8},{"name":"The Dominican Republic","stationcount":31},{"name":"The Falkland Islands Malvinas","stationcount":2},{"name":"The Faroe Islands","stationcount":5},{"name":"The Gambia","stationcount":1},{"name":"The Holy See","stationcount":12},{"name":"The Netherlands","stationcount":473},{"name":"The Philippines","stationcount":32},{"name":"The Republic Of Korea","stationcount":58},{"name":"The Republic Of Moldova","stationcount":39},{"name":"The Russian Federation","stationcount":1150},{"name":"The Sudan","stationcount":3},{"name":"The Turks And Caicos Islands","stationcount":1},{"name":"The United Arab Emirates","stationcount":47},{"name":"The United Kingdom Of Great Britain And Northern Ireland","stationcount":702},{"name":"The United States Minor Outlying Islands","stationcount":1},{"name":"The United States Of America","stationcount":4783},{"name":"Togo","stationcount":1},{"name":"Tonga","stationcount":1},{"name":"Trinidad And Tobago","stationcount":11},{"name":"Tunisia","stationcount":48},{"name":"Turkey","stationcount":197},{"name":"Turkmenistan","stationcount":3},{"name":"US Virgin Islands","stationcount":12},{"name":"Uganda","stationcount":7},{"name":"Ukraine","stationcount":249},{"name":"United Republic Of Tanzania","stationcount":29},{"name":"Uruguay","stationcount":44},{"name":"Uzbekistan","stationcount":3},{"name":"Vanuatu","stationcount":1},{"name":"Vietnam","stationcount":30},{"name":"Wallis And Futuna","stationcount":1},{"name":"Yemen","stationcount":2},{"name":"Zambia","stationcount":13},{"name":"Zimbabwe","stationcount":3}];
var radio_languages = [{"name":"aboriginal languages","stationcount":5},{"name":"afrikaans","stationcount":12},{"name":"afrikaans english","stationcount":1},{"name":"akan","stationcount":2},{"name":"albanian","stationcount":30},{"name":"all","stationcount":3},{"name":"allemand","stationcount":1},{"name":"alsatian","stationcount":1},{"name":"american","stationcount":6},{"name":"american english","stationcount":2},{"name":"amharic","stationcount":2},{"name":"ancient greek backwards","stationcount":1},{"name":"anglais","stationcount":1},{"name":"any","stationcount":3},{"name":"arab","stationcount":1},{"name":"arabe","stationcount":4},{"name":"arabic","stationcount":249},{"name":"arabisch","stationcount":1},{"name":"aragonés","stationcount":1},{"name":"armaneian","stationcount":1},{"name":"armenian","stationcount":11},{"name":"ashanti","stationcount":2},{"name":"asian","stationcount":2},{"name":"assorted","stationcount":3},{"name":"ayapaneco","stationcount":1},{"name":"azerbaijan","stationcount":4},{"name":"azerbaijani","stationcount":8},{"name":"bahasa indonesia","stationcount":40},{"name":"bambara","stationcount":1},{"name":"bashkir","stationcount":2},{"name":"basque","stationcount":12},{"name":"bayrisch","stationcount":1},{"name":"bearnese","stationcount":1},{"name":"belarusian","stationcount":11},{"name":"belarussian","stationcount":3},{"name":"belorussian","stationcount":1},{"name":"bengali","stationcount":22},{"name":"bhojpuri","stationcount":1},{"name":"bilingual","stationcount":1},{"name":"bosanski","stationcount":1},{"name":"bosnia","stationcount":1},{"name":"bosnian","stationcount":22},{"name":"brazilian portuguese","stationcount":11},{"name":"breton","stationcount":7},{"name":"british","stationcount":5},{"name":"broken english","stationcount":1},{"name":"bulgarian","stationcount":89},{"name":"burmese","stationcount":15},{"name":"burmese korean vietnamese","stationcount":1},{"name":"cantonese","stationcount":63},{"name":"cantonese chinese","stationcount":16},{"name":"cassubian","stationcount":1},{"name":"castellano","stationcount":65},{"name":"catalan","stationcount":128},{"name":"català","stationcount":3},{"name":"catellano","stationcount":1},{"name":"cebuano","stationcount":1},{"name":"ch'ol","stationcount":1},{"name":"chata","stationcount":2},{"name":"chinese","stationcount":1900},{"name":"chol","stationcount":1},{"name":"chuvash","stationcount":2},{"name":"colombia","stationcount":1},{"name":"colombian","stationcount":1},{"name":"conquense","stationcount":1},{"name":"cope","stationcount":1},{"name":"coreano","stationcount":1},{"name":"creole","stationcount":15},{"name":"croatian","stationcount":148},{"name":"créole","stationcount":1},{"name":"cubano","stationcount":1},{"name":"cyberspace","stationcount":1},{"name":"cz","stationcount":7},{"name":"czech","stationcount":164},{"name":"dai language","stationcount":1},{"name":"danish","stationcount":63},{"name":"dansk","stationcount":4},{"name":"dansk/oldnordisk","stationcount":1},{"name":"dari","stationcount":1},{"name":"de","stationcount":9},{"name":"deutsch","stationcount":324},{"name":"deutsch - französisch - italienisch","stationcount":1},{"name":"deutsch english","stationcount":3},{"name":"deutsch german","stationcount":95},{"name":"deutsch u.a.","stationcount":3},{"name":"deutsch/niederländisch","stationcount":1},{"name":"deutschland","stationcount":2},{"name":"deutscvh","stationcount":1},{"name":"dhivehi","stationcount":1},{"name":"dolnoserbšćina","stationcount":3},{"name":"dutch","stationcount":387},{"name":"dutch/english","stationcount":10},{"name":"dutch/flemish/english","stationcount":2},{"name":"ecuador","stationcount":2},{"name":"elglish","stationcount":1},{"name":"emglish","stationcount":1},{"name":"en","stationcount":15},{"name":"eng","stationcount":4},{"name":"engish","stationcount":2},{"name":"england","stationcount":1},{"name":"englich","stationcount":1},{"name":"englis","stationcount":2},{"name":"englisch","stationcount":20},{"name":"englisg","stationcount":1},{"name":"english","stationcount":7522},{"name":"english  afrikaans","stationcount":2},{"name":"english arabic","stationcount":1},{"name":"english hindi","stationcount":2},{"name":"english manx","stationcount":1},{"name":"english pakistani hindi indian","stationcount":1},{"name":"english pakistani hindi punjabi","stationcount":1},{"name":"english/french","stationcount":27},{"name":"englisj","stationcount":1},{"name":"es","stationcount":6},{"name":"esañol","stationcount":2},{"name":"esopañol","stationcount":1},{"name":"espagol","stationcount":1},{"name":"espanhol","stationcount":2},{"name":"espaniol","stationcount":1},{"name":"espanol","stationcount":12},{"name":"espanol spanish","stationcount":5},{"name":"español","stationcount":649},{"name":"español latino","stationcount":102},{"name":"español latinoamerica","stationcount":1},{"name":"esperanto","stationcount":1},{"name":"estonia","stationcount":1},{"name":"estonian","stationcount":34},{"name":"european","stationcount":1},{"name":"euskara","stationcount":1},{"name":"euskera","stationcount":9},{"name":"f","stationcount":1},{"name":"fa","stationcount":1},{"name":"farance","stationcount":1},{"name":"faroese","stationcount":5},{"name":"farsi","stationcount":8},{"name":"fdgjh","stationcount":1},{"name":"fge spain","stationcount":1},{"name":"fijian","stationcount":3},{"name":"filipino","stationcount":8},{"name":"finnish","stationcount":106},{"name":"flamand","stationcount":1},{"name":"flemish","stationcount":8},{"name":"fr","stationcount":18},{"name":"fr-ca","stationcount":1},{"name":"fr/ it","stationcount":1},{"name":"francais","stationcount":82},{"name":"francais et gallo","stationcount":1},{"name":"france","stationcount":10},{"name":"frances","stationcount":2},{"name":"francias","stationcount":2},{"name":"francês","stationcount":3},{"name":"französisch","stationcount":4},{"name":"français","stationcount":364},{"name":"français french","stationcount":6},{"name":"français kanak","stationcount":1},{"name":"français 🇫🇷","stationcount":3},{"name":"française","stationcount":1},{"name":"françois","stationcount":1},{"name":"frencg","stationcount":1},{"name":"french","stationcount":1601},{"name":"french français","stationcount":11},{"name":"frensh","stationcount":2},{"name":"frysk","stationcount":1},{"name":"furlan","stationcount":1},{"name":"gaelic","stationcount":2},{"name":"galego","stationcount":7},{"name":"galician","stationcount":16},{"name":"gascon","stationcount":1},{"name":"georgian","stationcount":14},{"name":"germain","stationcount":1},{"name":"german","stationcount":2597},{"name":"german dutch","stationcount":3},{"name":"german englisch dutch","stationcount":3},{"name":"german english","stationcount":3},{"name":"german english dutch","stationcount":1},{"name":"german/english/spanish","stationcount":1},{"name":"germany","stationcount":19},{"name":"germeny","stationcount":1},{"name":"grec","stationcount":1},{"name":"greec","stationcount":1},{"name":"greece","stationcount":2},{"name":"greek","stationcount":233},{"name":"greek & english","stationcount":6},{"name":"greek (ελληνικά)","stationcount":50},{"name":"greenlandic","stationcount":1},{"name":"griechisch","stationcount":1},{"name":"guarani","stationcount":2},{"name":"guaraní","stationcount":1},{"name":"gujarati","stationcount":1},{"name":"haitian creole","stationcount":3},{"name":"hakka","stationcount":1},{"name":"hani language","stationcount":1},{"name":"hawaiian","stationcount":5},{"name":"hebrew","stationcount":92},{"name":"hebrrw","stationcount":1},{"name":"hindi","stationcount":93},{"name":"hindko","stationcount":1},{"name":"hindu","stationcount":1},{"name":"hokkien","stationcount":3},{"name":"hornjoserbšćina","stationcount":3},{"name":"hrvatski","stationcount":5},{"name":"http://192.99.1.139:8982/","stationcount":1},{"name":"http://infant.antfarm.co.za/sfm/1sfm.asx","stationcount":1},{"name":"http://mcrscast1.mcr.iol.pt/comercial.mp3","stationcount":1},{"name":"http://stream.laut.fm/truckersmp","stationcount":1},{"name":"http://stream.simulatorradio.com:8002/stream.mp3","stationcount":1},{"name":"http://stream01.ilovemusic.de/iloveradio20.mp3","stationcount":1},{"name":"https://player.slam.nl/?stream=slam","stationcount":1},{"name":"https://stream.playradio.rs:8443/play.mp3","stationcount":1},{"name":"hu","stationcount":1},{"name":"hungarian","stationcount":195},{"name":"hungary","stationcount":6},{"name":"icelandic","stationcount":23},{"name":"igbo","stationcount":2},{"name":"indonesia","stationcount":30},{"name":"indonesian","stationcount":42},{"name":"ingles","stationcount":17},{"name":"inglese","stationcount":1},{"name":"inglish","stationcount":1},{"name":"inglés","stationcount":3},{"name":"inglês","stationcount":3},{"name":"instrumental","stationcount":4},{"name":"internacional","stationcount":1},{"name":"international","stationcount":9},{"name":"inuktitut","stationcount":2},{"name":"iran","stationcount":1},{"name":"irani","stationcount":1},{"name":"iranian","stationcount":1},{"name":"irish","stationcount":7},{"name":"isizulu","stationcount":3},{"name":"ita","stationcount":1},{"name":"italia","stationcount":1},{"name":"italian","stationcount":1023},{"name":"italiano","stationcount":120},{"name":"italiano  inglese","stationcount":1},{"name":"italien","stationcount":1},{"name":"italienisch","stationcount":3},{"name":"italy","stationcount":4},{"name":"jafri","stationcount":1},{"name":"jamaican","stationcount":1},{"name":"japan","stationcount":1},{"name":"japanes","stationcount":1},{"name":"japanese","stationcount":135},{"name":"japanese/spanish","stationcount":6},{"name":"javanese","stationcount":3},{"name":"javanesse","stationcount":1},{"name":"jawa","stationcount":2},{"name":"kalaallusit","stationcount":1},{"name":"kannada","stationcount":3},{"name":"kaurna","stationcount":1},{"name":"kazakh","stationcount":13},{"name":"kham","stationcount":1},{"name":"khmer","stationcount":10},{"name":"khmer lao uyghur","stationcount":1},{"name":"kichwa","stationcount":1},{"name":"kikuyu","stationcount":3},{"name":"kinyarwanda","stationcount":2},{"name":"kirghiz","stationcount":1},{"name":"kiswahili","stationcount":4},{"name":"korean","stationcount":56},{"name":"kpop","stationcount":1},{"name":"kriolu","stationcount":5},{"name":"kurdish","stationcount":3},{"name":"kyrgyz","stationcount":4},{"name":"ladin","stationcount":1},{"name":"latino","stationcount":2},{"name":"latvian","stationcount":42},{"name":"latviešu","stationcount":1},{"name":"lebanese","stationcount":1},{"name":"lithuanian","stationcount":48},{"name":"liverpool","stationcount":1},{"name":"luganda","stationcount":2},{"name":"lul","stationcount":1},{"name":"luxembourg","stationcount":4},{"name":"luxembourgish","stationcount":9},{"name":"lëtzebuergesch","stationcount":2},{"name":"macedonian","stationcount":9},{"name":"magyar","stationcount":7},{"name":"malagasy","stationcount":9},{"name":"malay","stationcount":6},{"name":"malayalam","stationcount":27},{"name":"malgache","stationcount":3},{"name":"maltese","stationcount":19},{"name":"maltese and english","stationcount":6},{"name":"maltesisch","stationcount":1},{"name":"malti","stationcount":2},{"name":"mandarin","stationcount":11},{"name":"manx","stationcount":1},{"name":"many languages","stationcount":2},{"name":"marathi","stationcount":6},{"name":"maya chontal","stationcount":1},{"name":"miraj","stationcount":1},{"name":"mongolian","stationcount":21},{"name":"montenegrin","stationcount":6},{"name":"multilingual","stationcount":75},{"name":"music","stationcount":1},{"name":"music only","stationcount":4},{"name":"n/a","stationcount":1},{"name":"nahuatl","stationcount":1},{"name":"nedelands","stationcount":3},{"name":"nederlands","stationcount":49},{"name":"nedersaksisch","stationcount":1},{"name":"nepali","stationcount":9},{"name":"netherland","stationcount":2},{"name":"netherlands","stationcount":10},{"name":"niederländisch","stationcount":2},{"name":"nl","stationcount":5},{"name":"noce","stationcount":1},{"name":"none","stationcount":2},{"name":"norsk","stationcount":5},{"name":"norwegian","stationcount":82},{"name":"norwegisch","stationcount":1},{"name":"occitan","stationcount":6},{"name":"onlien tamil radio","stationcount":1},{"name":"ossetian","stationcount":1},{"name":"pali","stationcount":1},{"name":"papiamento","stationcount":9},{"name":"papiamento english spanish","stationcount":1},{"name":"pashto","stationcount":5},{"name":"patois","stationcount":1},{"name":"persian","stationcount":37},{"name":"philipino","stationcount":1},{"name":"pidgin","stationcount":1},{"name":"pl","stationcount":4},{"name":"plattdüütsch","stationcount":2},{"name":"plautdietsch","stationcount":2},{"name":"polaco","stationcount":1},{"name":"poland","stationcount":8},{"name":"poli","stationcount":1},{"name":"polish","stationcount":691},{"name":"polski","stationcount":47},{"name":"polskie","stationcount":3},{"name":"pop","stationcount":1},{"name":"portugal","stationcount":1},{"name":"portugese","stationcount":1},{"name":"portugues","stationcount":23},{"name":"portugues brasileiro","stationcount":3},{"name":"portuguesa","stationcount":2},{"name":"portuguese","stationcount":572},{"name":"portuguese (brazil)","stationcount":6},{"name":"portuguese_br","stationcount":1},{"name":"português","stationcount":82},{"name":"português br","stationcount":1},{"name":"português brasil","stationcount":19},{"name":"português brasileiro","stationcount":9},{"name":"português do","stationcount":1},{"name":"português do brasil","stationcount":105},{"name":"português inglês","stationcount":1},{"name":"portugês","stationcount":2},{"name":"portugês brasileiro","stationcount":2},{"name":"psytrance","stationcount":1},{"name":"pt","stationcount":6},{"name":"pt - br","stationcount":1},{"name":"pt br","stationcount":2},{"name":"pt/br","stationcount":1},{"name":"pt_br","stationcount":8},{"name":"punjabi","stationcount":41},{"name":"p´urhépecha","stationcount":1},{"name":"quechua","stationcount":1},{"name":"québecois","stationcount":1},{"name":"ro","stationcount":1},{"name":"romana","stationcount":9},{"name":"romanian","stationcount":160},{"name":"romansh","stationcount":1},{"name":"roots","stationcount":1},{"name":"rossia","stationcount":1},{"name":"ru","stationcount":37},{"name":"ru-en","stationcount":1},{"name":"rumänisch","stationcount":1},{"name":"rus","stationcount":1},{"name":"rusian","stationcount":20},{"name":"russia","stationcount":31},{"name":"russian","stationcount":875},{"name":"russisch","stationcount":2},{"name":"sachsen","stationcount":1},{"name":"sami","stationcount":2},{"name":"sanskrit","stationcount":2},{"name":"sardinian","stationcount":1},{"name":"satanic","stationcount":1},{"name":"schwedisch","stationcount":1},{"name":"schwäbisch","stationcount":1},{"name":"scottish","stationcount":1},{"name":"scottish gaelic","stationcount":1},{"name":"senegales","stationcount":1},{"name":"sepedi","stationcount":3},{"name":"serbia","stationcount":1},{"name":"serbian","stationcount":113},{"name":"sesotho","stationcount":1},{"name":"setswana","stationcount":2},{"name":"sheng","stationcount":2},{"name":"shimaoré","stationcount":1},{"name":"shqip","stationcount":13},{"name":"sindhi","stationcount":2},{"name":"sinhala","stationcount":16},{"name":"sinhalese","stationcount":1},{"name":"slovak","stationcount":75},{"name":"slovene","stationcount":2},{"name":"slovenian","stationcount":47},{"name":"slovenscina","stationcount":1},{"name":"slovensky","stationcount":1},{"name":"slovenský","stationcount":3},{"name":"somali","stationcount":3},{"name":"sorbian","stationcount":4},{"name":"spanglish","stationcount":1},{"name":"spanich","stationcount":1},{"name":"spanisch","stationcount":8},{"name":"spanish","stationcount":1414},{"name":"spanish/catalan","stationcount":5},{"name":"spanish/english","stationcount":35},{"name":"sranan tongo","stationcount":1},{"name":"srbski","stationcount":2},{"name":"srpski","stationcount":3},{"name":"stockholm","stationcount":1},{"name":"surinaams","stationcount":1},{"name":"surinam","stationcount":1},{"name":"svenska","stationcount":4},{"name":"swahili","stationcount":37},{"name":"swedish","stationcount":106},{"name":"swiss german","stationcount":10},{"name":"swissgerman","stationcount":3},{"name":"tagalog","stationcount":18},{"name":"taiwan","stationcount":1},{"name":"taiwanese","stationcount":1},{"name":"tajik","stationcount":1},{"name":"talian","stationcount":1},{"name":"tamazight","stationcount":1},{"name":"tamil","stationcount":41},{"name":"tansen","stationcount":1},{"name":"tatar","stationcount":6},{"name":"tchech","stationcount":1},{"name":"te reo maori","stationcount":3},{"name":"telugu","stationcount":7},{"name":"teochew","stationcount":2},{"name":"thai","stationcount":74},{"name":"tibetan","stationcount":12},{"name":"tongan","stationcount":1},{"name":"tshivenda","stationcount":1},{"name":"tunisian","stationcount":1},{"name":"turk","stationcount":1},{"name":"turkce","stationcount":1},{"name":"turkish","stationcount":116},{"name":"turkmen","stationcount":3},{"name":"türkçe","stationcount":11},{"name":"ua","stationcount":1},{"name":"ukaraine","stationcount":1},{"name":"ukr","stationcount":2},{"name":"ukraine","stationcount":4},{"name":"ukrainian","stationcount":213},{"name":"undefined","stationcount":52},{"name":"united kingdom","stationcount":1},{"name":"urdu","stationcount":10},{"name":"urdu hindi","stationcount":1},{"name":"us","stationcount":2},{"name":"uyghur","stationcount":8},{"name":"uzbek","stationcount":4},{"name":"valencian","stationcount":1},{"name":"valenciano","stationcount":1},{"name":"valencià","stationcount":2},{"name":"various","stationcount":1},{"name":"vietnamese","stationcount":29},{"name":"vlams","stationcount":1},{"name":"vn","stationcount":1},{"name":"welsh","stationcount":4},{"name":"whovian","stationcount":1},{"name":"wir sind dein lieblings-vielfaltmix aus der größte","stationcount":1},{"name":"world","stationcount":2},{"name":"xhosa","stationcount":1},{"name":"xitsonga","stationcount":2},{"name":"yeet","stationcount":1},{"name":"yiddish","stationcount":1},{"name":"yoruba","stationcount":1},{"name":"your driving music soundtrack","stationcount":2},{"name":"yugoslavia","stationcount":2},{"name":"yugoslavian","stationcount":1},{"name":"český","stationcount":5},{"name":"ελληνικά","stationcount":2},{"name":"ελληνική","stationcount":1},{"name":"български","stationcount":17},{"name":"русский","stationcount":64},{"name":"украинский","stationcount":1},{"name":"українська","stationcount":1},{"name":"אנגלית","stationcount":4},{"name":"יוונית","stationcount":1},{"name":"ספרדית","stationcount":1},{"name":"עברית","stationcount":44},{"name":"ערבית","stationcount":2},{"name":"צרפתית","stationcount":1},{"name":"רב לשוני","stationcount":1},{"name":"רוסית","stationcount":2},{"name":"中文","stationcount":2},{"name":"日本語","stationcount":4}];

// online offline
window.addEventListener('offline', function(e) {
    console.log('offlinedddd');
    $('nav.navbar').addClass('bg-grey');
});

window.addEventListener('online', function(e) {
    console.log('online');
    $('nav.navbar').removeClass('bg-grey');
});

// Broad cast that your're opening a page.
function checkOpenWindows(winname) {
    localStorage[winname+'_open'] = Date.now();
    var onLocalStorageEvent = function (e) {
        if (e.key === winname+'_open') {
            // Listen if anybody else opening the same page!
            localStorage[winname+'_available'] = Date.now();
        }
        if (e.key === winname+'_available') {
            swal.fire("Use one window!", "BKC Control Panel is open in another tab or window, Please don't open BKC Panel Control in multiple windows!", "warning", {closeOnClickOutside: false});
        }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);
}

//Geo location
function getBrowserLocation(callback,err){
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                callback(pos);
            },
            (error) => {
                console.error(locationError(error));
                err(error)
            }
        );
    } else {
        // Browser doesn't support Geolocation
        console.error('Browser doesn\'t support Geolocation ');
    }
}

function locationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for geolocation.";
        case error.POSITION_UNAVAILABLE:
            return "Location information is currently unavailable.";
        case error.TIMEOUT:
            return "Request for user location timed out.";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred.";
    }
}

//shared devices
var sharedDevices = [];

var loadSharedDevices = function () {
    $.getJSON('/iadevice/shared/null', function (data) {
        sharedDevices = data;
    });
}

loadSharedDevices();

//show shared devices with map and search
function showSharedDevices(combo,devname, devtype){
    console.log(devname, devtype, sharedDevices)
    setTimeout(function (){initMapDevicesDialog(combo, sharedDevices.filter((d)=>d.DeviceType===devtype))}, 1000)
    $("#ShareDevicesMapModal").modal('show');
}
