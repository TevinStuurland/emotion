var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	removePaddingChars: function(input){
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if(lkey == 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;
	}
}

var textArray = [
    'anger',
    'contempt',
		'disgust',
		'fear',
		'happiness',
		'neutral',
		'sadness',
		'surprise'
];
var randomNumber = Math.floor(Math.random()*textArray.length);

function setChallenge () {
	changeDoc = document.querySelector('.challenge p').innerHTML = textArray[randomNumber]
}

setChallenge()

//apiKey: Replace this with your own Project Oxford Emotion API key, please do not use my key. I include it here so you can get up and running quickly but you can get your own key for free at https://www.projectoxford.ai/emotion
var apiKey = "d6bc951e60d54b5a9180e63fecdce4af";

//apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

function CallAPI(Img, apiUrl, apiKey)
{
$.ajax({
url: apiUrl,
beforeSend: function (xhrObj) {
xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
},
type: "POST",
data: Img,
processData: false
})
.done(function (response) {
ProcessResult(response);
console.log('done')
})
.fail(function (error) {
$("#response").text(error.getAllResponseHeaders());
});
}

function ProcessResult(response)
{
var data = JSON.stringify(response);
kek = response[0].scores;
console.log(kek)
console.log(response)
$("#response").text(data);
}

(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var photo2 = null;
  var startbutton = null;
  var count = 0;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    photo2 = document.getElementById('photo-2');
    startbutton = document.getElementById('startbutton');

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4/3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      count++;
      // var counter = count % 2;
      // console.log(counter);
      ev.preventDefault();
    }, false);

    clearphoto();
  }



  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#00995F";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    photo2.setAttribute('src', data);
  }


  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/png'),
      test = dataURItoBlob( data )

         function snapPost () {
            let file = document.getElementById('photo').src.substring(23).replace(' ', '+');
            let Img = Base64Binary.decodeArrayBuffer(file);
            let ajax = new XMLHttpRequest();
            console.log('Photo 1 in case');
            CallAPI(test, apiUrl, apiKey)
           }
             function snapPost2 () {
            let file = document.getElementById('photo-2').src.substring(23).replace(' ', '+');
            let Img = Base64Binary.decodeArrayBuffer(file);
            let ajax = new XMLHttpRequest();
            console.log('Photo 1 in case');
            CallAPI(test, apiUrl, apiKey)
           }

      switch (count % 2) {
        case 0:
        photo.setAttribute('src', data);
          console.log('Photo 1');
          snapPost()
          break;
        case 1: // foo is 0 so criteria met here so this block will run
        photo2.setAttribute('src', data);
          console.log('Photo 2');
          snapPost2()
          // NOTE: the forgotten break would have been here
      };
      console.log(count);


    } else {
      clearphoto();
    }
  }



  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
