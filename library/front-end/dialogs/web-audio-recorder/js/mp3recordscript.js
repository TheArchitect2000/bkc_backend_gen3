//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

// var encodingTypeSelect = document.getElementById("encodingTypeSelect");
// var recordButton = document.getElementById("recordButton");
// var stopButton = document.getElementById("stopButton");

//add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);

var recordtimer = null;
function startRecording() {


	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		$('#recording-pan #recordingtext').text('Recording ...')
		$('#recording-pan #recordingicon').addClass('scale-up-center')

		$('#recording-pan').fadeIn();

		//start timer
		var rectime = 0;
		recordtimer = setInterval(function (){
			rectime++;
			$('#recordingtimer').text(rectime + ' sec')
		}, 1000)

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		// document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"
		__log("Format: 2 channel mp3 @ "+audioContext.sampleRate/1000+"kHz");

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		// encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		encodingType = 'mp3';

		//disable the encoding selector
		// encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "../dialogs/web-audio-recorder/js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			// encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();

		 __log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	// recordButton.disabled = false;
    	// stopButton.disabled = true;
		console.error(err);
		swal.fire("Error", "Microsoft access problem", "error");
	});

	//disable the record button
    // recordButton.disabled = true;
    // stopButton.disabled = false;
}

function stopRecording() {
	$('#recording-pan #recordingicon').removeClass('scale-up-center')
	$('#recording-pan #recordingtext').text('Converting ...');

	console.log("stopRecording() called");

	clearInterval(recordtimer)
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	// stopButton.disabled = true;
	// recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	__log('Recording stopped');
}

function createDownloadLink(blob,encoding) {

	$('#recording-pan').hide();

	var url = URL.createObjectURL(blob);
	__log(url)

	var audio = document.getElementById('audio-preview');

	audio.controls = true;
	audio.src = url;
	$(audio).show();

	getDuration (url, function (duration) {
		$('#R_UPLD_C-duration').val(duration);
		var dur = formatDuration(duration);
		$('#R_UPLD_C-duration-show').text('Duration: '+dur);
	});

	$('form#R_UPLD_C-form').show();
	$('#R_UPLD_C-file-name').show();
	$('#R_UPLD_C-file-label').hide();//.removeClass("mdi-stop-circle mdi-spin").addClass("UPLICON");//.unbind("click").click(R_UPLD_C_run);
	$('#R_UPLD_C-btn2').show();
	$('#R_UPLD_C-cancel').show();
	$('#R_UPLD_C-file-name').val('Recorded'+Date.now());
	$('#R_UPLD_C-file-name').attr('placeholder','Set a name for this voice');

	$('#recordingtimer').text('0 sec');


	share_blob = blob;
	var size = blob.size;
	if(size >= 1000000) size = Math.round(size/1000000,2) + ' MB';
	else if(size >= 1000) size = Math.round(size/1000,0) + ' KB';
	$('#R_UPLD_C-size').text('Size: '+size);

	// var au = document.createElement('audio');
	// var li = document.createElement('li');
	// var link = document.createElement('a');

	//add controls to the <audio> element
	// au.controls = true;
	// au.src = url;


	//link the a element to the blob
	// link.href = url;
	// link.download = new Date().toISOString() + '.'+encoding;
	// link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	// li.appendChild(au);
	// li.appendChild(link);

	//add the li element to the ordered list
	// document.appendChild(li);
}



//helper function
function __log(e, data) {
	console.log(e, data)
	// log.innerHTML += "\n" + e + " " + (data || '');
}