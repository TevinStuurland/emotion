//apiKey: Replace this with your own Project Oxford Emotion API key, please do not use my key. I include it here so you can get up and running quickly but you can get your own key for free at https://www.projectoxford.ai/emotion
var apiKey = "d6bc951e60d54b5a9180e63fecdce4af";

//apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

var photo = document.getElementById("photo");
var photo2 = document.getElementById("photo-2");

var attribute = photo.getAttribute('src');

$('#btn').click(function () {
//file: The file that will be sent to the api
var file = attribute;

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
