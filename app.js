var express = require('express')
var url = require('url')
var telldus = require('telldus')
var ws = require("nodejs-websocket")

var port = process.env.PORT || 9000
var portWs = 9001

var app = express()
app.set('port', port)
app.use(express.static(__dirname + '/public'))

app.get('/api/on', function(request, response) {
  var query = url.parse(request.url, true).query
  if (query && query.id) {
    telldus.turnOn(parseInt(query.id), function(err) {
      var res = "OK: turn on id:" + query.id
      console.log(res)
      response.send(res)
    })
  }
})

app.get('/api/off', function(request, response) {
  var query = url.parse(request.url, true).query
  if (query && query.id) {
    telldus.turnOff(parseInt(query.id), function(err) {
      var res = "OK: turn off id:" + query.id
      console.log(res)
      response.send(res)
    })
  }
})

app.get("/api/list", function(request, response) {
  telldus.getDevices(function(err,devices) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log(devices)
      response.send(devices)
    }
  })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

var server = ws.createServer(function (conn) {
  sendState(conn)

  conn.on("text", function (str) {
    console.log("Received "+str)
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
})
server.listen(portWs)

var sensorState = { temp1: "", humidity1: "", temp2: "", humidity2: "" }

var listener = telldus.addSensorEventListener(function(deviceId,protocol,model,type,value,timestamp) {
  updateSensorState(deviceId, type, value)
  server.connections.forEach(function (conn) { sendState(conn) })
})

var deviceListener = telldus.addDeviceEventListener(function(deviceId, status) {
  console.log('Device ' + deviceId + ' is now ' + status.name)
  console.log(status)
})

function updateSensorState(deviceId, type, value) {
  if (deviceId == "11" && type == 1) sensorState.temp1 = value
  else if (deviceId == "11" && type == 2) sensorState.humidity1 = value
  else if (deviceId == "21" && type == 1) sensorState.temp2 = value
  else if (deviceId == "21" && type == 2) sensorState.humidity2 = value
  else console.log("unknown sensor info: " + deviceId + "," + type + "," + value)
}

function sendState(conn) {
  conn.sendText(JSON.stringify(sensorState))
}