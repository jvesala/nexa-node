var express = require('express')
var url = require('url')
var telldus = require('telldus')

var app = express();
app.set('port', (process.env.PORT || 9000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/api/on', function(request, response) {
  var query = url.parse(request.url, true).query
  if (query && query.id) {
    console.log("Turning on id " + query.id)
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
    console.log("Turning off id " + query.id)
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

var listener = telldus.addSensorEventListener(function(deviceId,protocol,model,type,value,timestamp) {
  console.log('New sensor event received: ',deviceId,protocol,model,type,value,timestamp);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})