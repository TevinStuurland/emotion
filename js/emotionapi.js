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
    context.fillStyle = "#695744";
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

      var data = canvas.toDataURL('image/png');

      switch (count % 2) {
        case 0:
        photo.setAttribute('src', data);
          console.log('Photo 1');
          break;
        case 1: // foo is 0 so criteria met here so this block will run
        photo2.setAttribute('src', data);
          console.log('Photo 2');
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

//apiKey: Replace this with your own Project Oxford Emotion API key, please do not use my key. I include it here so you can get up and running quickly but you can get your own key for free at https://www.projectoxford.ai/emotion
var apiKey = "d6bc951e60d54b5a9180e63fecdce4af";

//apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

$('#btn').click(function () {
//file: The file that will be sent to the api
var file = document.getElementById('filename').files[0];

CallAPI(file, apiUrl, apiKey);
});

function CallAPI(file, apiUrl, apiKey)
{
$.ajax({
url: apiUrl,
beforeSend: function (xhrObj) {
xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
},
type: "POST",
data: file,
processData: false
})
.done(function (response) {
ProcessResult(response);
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
$("#response").text(data);
}
