function targetValue(e) {
  return e.target.value
}

function turnOn(id) {
  return $.ajaxAsObservable({ url: "/api/on?id=" + id, cache: false })
}

function turnOff(id) {
  return $.ajaxAsObservable({ url: "/api/off?id=" + id, cache: false })
}

function handleWc(type, value) {
  if (type == "type=1") $('.temperature.wc').val(value.split("=")[1])
  else $('.humidity.wc').val(value.split("=")[1])
}

function handleOutside(type, value) {
  if (type == "type=1") $('.temperature.outside').val(value.split("=")[1])
  else $('.humidity.outside').val(value.split("=")[1])
}

$(function() {
  $('button.switch.on').clickAsObservable().select(targetValue).subscribe(function(id) {
    turnOn(id).subscribe(function(x) {  console.log("Turned on " + id) })
  })

  $('button.switch.off').clickAsObservable().select(targetValue).subscribe(function(id) {
    turnOff(id).subscribe(function(x) {  console.log("Turned off " + id) })
  })

  var connection = new WebSocket("ws://"+window.location.hostname+":9001")
  connection.onmessage = function (event) {
    var data = event.data.split(",")
    if (data[0] == "deviceId=11") handleWc(data[1], data[2])
    else handleOutside(data[1], data[2])
  }
})