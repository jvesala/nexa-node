function targetValue(e) {
  return e.target.value
}

function turnOn(id) {
  return $.ajaxAsObservable({ url: "/api/on?id=" + id, cache: false })
}

function turnOff(id) {
  return $.ajaxAsObservable({ url: "/api/off?id=" + id, cache: false })
}

function updateSensorData(data) {
  $('.temperature.wc').text(data.temp1)
  $('.humidity.wc').text(data.humidity1)

  $('.temperature.outside').text(data.temp2)
  $('.humidity.outside').text(data.humidity2)
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
    console.log(event)
    updateSensorData(event.data)
  }
})