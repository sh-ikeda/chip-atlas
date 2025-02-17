// get url parameter
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

// set variables
var reqId = getUrlParameter('id');
var title = getUrlParameter('title');

var wabiUrl = "http://ddbj.nig.ac.jp/wabi/chipatlas/";
var reqUrl = wabiUrl + reqId;
var resultUrl = reqUrl + "?info=result";

$('td#project-title').text(title);
$('td#request-id').text(reqId);
$('a#result-url').text(resultUrl+"&format=html");
$('a#download-tsv').text(resultUrl+"&format=tsv");

// date format converter function
function dateFormat(date){
  var f = date.toString().split(" ");
  return f[4] + " (" + f[1] + "-" + f[2] + "-" + f[3] + ")";
}

// submit time and clock
var now = new Date();
$('td#submitted-at').text(dateFormat(now));

var calcm = getUrlParameter('calcm');
var calcTime;
switch(true){
  case "-" == calcm:
    calcTime = 0;
    break;
  case /mins$/.test(calcm):
    calcTime = calcm.split(" ")[0];
    break;
  case /hr$/.test(calcm):
    calcTime = calcm.split(" ")[0] * 60;
    break;
}
var estFinish = new Date(now.setMinutes(now.getMinutes()+parseInt(calcTime,10)));
$('td#estimated-finishing-time').text(dateFormat(estFinish));

// Clock
$(function(){
  setInterval(function(){
    t = new Date();
    $('td#current-time').text(dateFormat(t));
  }, 1000);
});

// checking status
$(function(){
  var tdStatus = $('td#status');
  var interval = setInterval(function(){
    $.get("/wabi_chipatlas?id="+reqId, function(status){
      tdStatus.text(status);
      if(status == "finished"){
        tdStatus.css("color","red");
        $('a#result-url').attr('href', resultUrl+"&format=html");
        $('a#download-tsv').attr('href', resultUrl+"&format=tsv");
        clearInterval(interval);
      } else if (status == "unavailable") {
        alert("No response from the DDBJ supercomputer system: please note the result URL to access later. It is possible that your job has been interrupted by the system error, in that case you may need to run the analysis again.");
        clearInterval(interval);
      }
    });
  }, 10000);
});
