// mehdi
// created according to  <!--https://weatherwidget.io/-->
// var _locationid = '49d28n123d12', _locationname = 'vancouver', _locationtitle = 'VANCOUVER';

function drawIAWeather() {

    var locationid = localStorage.locationid || '49d28n123d12',
        locationname = localStorage.locationname || 'vancouver';
    var locationtitle = locationname[0].toUpperCase()+locationname.substr(1).toLowerCase();

    var weatherstring = `<a onclick="return false" class="weatherwidget-io"
    href2="https://forecast7.com/en/35d6951d39/tehran/"
    href3="https://forecast7.com/en/49d28n123d12/vancouver/"
    href="https://forecast7.com/en/${locationid}/${locationname}/"
    data-label_1="${locationtitle}" data-label_2="Now" data-days="5" data-mode1="Current"
    data-mode="${jQuery.browser.mobile?'Current':null}"
    data-theme1="weather_one"
    data-theme="pure" data-basecolor="rgba(255, 255, 255, 0)"
    style="pointer-events: none;">Weather Now</a>`
    /*+`<br><div onmouseleave="$('.cl-2').hide();$('#cl-1').show()" class="form-group">
    <span id="cl-1" onclick="$(this).hide();$('.cl-2').show();$('#cl-2').focus()" class="bg-light col-grey btn-sm ia-btn-small ">Change Location</span>
    <input id="cl-2" class=" cl-2" style="display: none" placeholder="Type Your City Name" >
    <span class="cl-2 bg-light col-grey btn-sm ia-btn-small " style="display: none" onclick="changeLocation1()">Find City</span>
    <div style="display: none" id="citylist" class="form-control cl-2"></div>
    </div>
    `*/;
    $('#weather-view').html(weatherstring);

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];/*if(!d.getElementById(id))*/{js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');

}



function changeLocation1() {
    var newlocation = $('#cl-2').val();
    //$('.cl-2').hide();
    $.getJSON('/weather/cities/'+newlocation , (cities)=>{
        cities = JSON.parse(cities);
        // console.error(cities);
        var s = `<select class="form-control" id="cl-city" onchange="changeLocation2()"><option value="0">Select from list</option> `;
        for(var city of cities){
            s += `<option value="${city.place_id}"> ${city.term}, ${city.label}</option>`;
        }
        s += `</select>`;
        $('#citylist').show().html(s);
    })

}

function changeLocation2() {
    var place_id = $('#cl-city').val();
    if(place_id==='0') return;
    $('#cl-1 , .cl-2').hide();
    $.get('/weather/citycode/'+place_id , (code)=>{
        code = code.split('/');
        localStorage.locationid = code[0];
        localStorage.locationname = code[1];
        localStorage.locationtitle = code[1];
        drawIAWeather();
    })

}

drawIAWeather();
