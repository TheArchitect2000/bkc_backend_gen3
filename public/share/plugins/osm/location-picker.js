$.fn.locationPicker = function(options) {

    var $this = this
    var settings = $.extend({
        address_el: 'input[data-type="address"]',
        map_el: '[data-type="map"]',
        save_el: '[data-type="location-store"]',
        raw_data: false,
        init: {
            current_location: true
        }
    }, options)

    var data = {}

    var txtAddress = $(settings.address_el)
    var mapEl = $(settings.map_el)
    var saveEl = $(settings.save_el)
    var init_zoom = 12
    var zoom = null
    var icon_url = 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png' //'/img/marker-icon.png'

    //devices
    var devices = settings.init.devices;

    var fix_location = settings.init.fix_location;

    var createMarkerIcon = function(icon_url) {
        var iconSize = new OpenLayers.Size(32, 32)
        var iconOffset = new OpenLayers.Pixel(-(iconSize.w / 2), -iconSize.h)
        var icon = new OpenLayers.Icon(icon_url, iconSize, iconOffset)

        return icon
    }

    var markerIcon = createMarkerIcon(icon_url)

    var generateRandId = function() {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        var id = randLetter + Date.now()
        return id
    }

    var clear = function() {
        data = {}
        markers.clearMarkers()
        saveData()

        onLocationChanged()
    }

    var saveData = function() {
        if (saveEl.length > 0) {
            saveEl.val(JSON.stringify(data))
        }
    }

    //////////
    const addMapPoint = (lat, lng, label, offsetY) => {
        iconStyle = [
            new OpenLayers.Style({
                image: new OpenLayers.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: "/static/images/pin.png",
                    scale: 1
                }))
            }),
            new OpenLayers.Style({
                text: new OpenLayers.Text({
                    text: label,
                    offsetY: offsetY,
                    scale: 2,
                    /*fill: new Fill({
                        color: '#black',
                    })*/
                })
            })
        ];

        const vectorLayer = new OpenLayers.layer.Vector({
            source: new OpenLayers.source.Vector({
                features: [new OpenLayers.Feature({geometry: new OpenLayers.geom.Point(OpenLayers.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))})]
            }),
            style: iconStyle
        });

        map.addLayer(vectorLayer);
    }
        //////////


    var readPlace = function(place) {
            var result = {
                address: place.formatted_address,
                location: {
                    lat: place.geometry.location.lat(),
                    long: place.geometry.location.lng()
                }
            }

            if (settings.raw_data) {
                data.raw = place
            }

            return result
        }
        /* Open Street Map config */
    var setMapLocation = function(lat, long, centerMap) {

        if (centerMap === undefined) centerMap = true

        setAddressInternal({
            // location: new google.maps.LatLng(lat, long)
        })

        var latLong = new OpenLayers.LonLat(long, lat).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        )

        //this variable is in map-gps-picker.html
        _pickedLocation = {lat: lat, long: long};

        if (!zoom) {
            zoom = init_zoom
        } else {
            zoom = map.getZoom()
        }

        if (centerMap) {
            map.setCenter(latLong, zoom)
        }

        marker = new OpenLayers.Marker(latLong, markerIcon)

        markers.clearMarkers()
        markers.addMarker(marker)

        if(settings.init.devices) {
            for(var dev of settings.init.devices) {
                var lat = dev.Share.GPS.lat;
                var long = dev.Share.GPS.long;
                var latLong = new OpenLayers.LonLat(long, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                    map.getProjectionObject() // to Spherical Mercator Projection
                )
                var icon_url = devicetemps[dev.DeviceType].icon;
                var marker = new OpenLayers.Marker(latLong, createMarkerIcon(icon_url));
                marker.devdata = dev;
                // marker.setTitle(dev.Name)
                marker.events.register( 'click', latLong, function (mrk){
                    //rise setting.init.callback in
                    settings.init.deviceSelect(mrk.object.devdata)
                } );

                markers.addMarker(marker);

                // addMapPoint(lat,  long, dev.Name, 20)

            }
        }
    }

    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions)
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            )
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            )
        },

        trigger: function(e) {
            var latLong = map.getLonLatFromPixel(e.xy).transform(
                    map.getProjectionObject(),
                    new OpenLayers.Projection("EPSG:4326")) // transform to WGS 1984

            data = {
                location: {
                    lat: latLong.lat,
                    long: latLong.lon
                }
            }

            // TODO init map with reverse geocode
            /*geoCoder.geocode({
                // location: new google.maps.LatLng(latLong.lat, latLong.lon)
            }, function(result, status) {
                if (status == 'OK') {
                    data = readPlace(result[0])
                }

                setMapLocation(data.location.lat, data.location.long, false)
                onLocationChanged()
            })*/

            if(!fix_location) {
                setMapLocation(data.location.lat, data.location.long, false)
            }
            onLocationChanged()
        }

    })

    var mapId = mapEl.attr('id')
    if (!mapId) {
        mapEl.attr('id', generateRandId())
    }

    var map = new OpenLayers.Map(mapEl.attr('id'))
    map.addLayer(new OpenLayers.Layer.OSM())

    var markers = new OpenLayers.Layer.Markers("Markers")
    map.addLayer(markers)

    var click = new OpenLayers.Control.Click()
    map.addControl(click)
    click.activate()

    var marker = null


    /* Google maps config */
    /*geoCoder = new google.maps.Geocoder()

    var autocomplete = new google.maps.places.Autocomplete(
        txtAddress[0], {
            types: ['geocode']
        })


    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        place = autocomplete.getPlace()

        data = readPlace(place)
        setMapLocation(data.location.lat, data.location.long)
        onLocationChanged()
    })*/

    this.getData = function() {
        return data
    }

    this.getAddress = function() {
        return data.formatted_address
    }

    var setAddressInternal = function(args) {
        /*geoCoder.geocode(args, function(result, status) {
            if (status == 'OK') {
                if (result.length > 0) {
                    data = readPlace(result[0])

                    setMapLocation(data.location.lat, data.location.long)
                    onLocationChanged()

                } else {
                    clear()
                }
            }
        })*/
    }

    this.setAddress = function(address) {
        setAddressInternal({
            address: address
        })
    }

    this.setLocation = function(lat, long) {
        setAddressInternal({
            // location: new google.maps.LatLng(lat, long)
        })
    }

    var init = function() {
        if (settings.init) {
            if (settings.init.current_location) {
                // set map to current location

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        setMapLocation(position.coords.latitude, position.coords.longitude)
                    }, function(error) {
                        // set map to default location
                        setMapLocation(49.217974, -122.992075)
                    })
                }
            } else if (settings.init.address) {
                $this.setAddress(settings.init.address)
            } else if (settings.init.location) {
                $this.setLocation(settings.init.location)
            }
        }
    }

    var onLocationChanged = function() {

        if (data.address) {
            txtAddress.val(data.address)
        }

        saveData()

        if (settings.locationChanged) {
            settings.locationChanged(data)
        }
    }

    init()

    return this
}
