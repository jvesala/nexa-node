function targetValue(e) {
  return e.target.value
}

function turnOn(id) {
  return $.ajaxAsObservable({ url: "/api/on", data: { id  : id }})
}

function turnOff(id) {
  return $.ajaxAsObservable({ url: "/api/on", data: { id  : id }})
}

$(function() {
  $('button.switch.on').clickAsObservable().select(targetValue).subscribe(function(id) {
    turnOn(id).subscribe(function(x) {  console.log("Turned on " + id) })
  })

  $('button.switch.off').clickAsObservable().select(targetValue).subscribe(function(id) {
    turnOff(id).subscribe(function(x) {  console.log("Turned off " + id) })
  })
})