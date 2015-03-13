var config          = require('./config.json');
var WebSocketServer = require('ws').Server;

var influx          = require('./db'),
    util            = require('util');

/**
 * Create WebSocket server
 */
exports.create = function() {

  var wss = new WebSocketServer({
    port           : config.wss.port,
    verifyClient   : verifyClient,
    clientTracking : false // disable tracking all clients, disable broadcasting
  });

  wss.on('connection', function(ws) {

    var msg = {
      'code'    : 200,
      'type'    : 'WELCOME',
      'message' : 'Welcome to Cerberus'
    };

    ws.send(JSON.stringify(msg));

    ws.on('message', function(metrics) {

      try {
        metrics = JSON.parse(metrics);
      } catch(ex) {
        return;
      }

      console.log('received: %j', metrics);

      var timestamp = new Date().toISOString();

      // send metrics to Database
      influx.write({
        "database": "localhost",
        "points": [
          {
            "name": "latency",
            "tags": {
              "host": metrics._meta.host,
              "path": metrics.req.path
            },
            "timestamp": timestamp,
            "fields": {
              "ms": parseFloat(metrics.res.delay.ms),
              "ns": metrics.res.delay.ns
            }
          },
          {
            "name": "payload",
            "tags": {
              "host": metrics._meta.host,
              "path": metrics.req.path
            },
            "timestamp": timestamp,
            "fields": {
              "size": parseInt(metrics.res.contentLength)
            }
          }
        ]
      });

    });

  });

};

/**
 * This function will verify the client to allow publishing analytics to
 * our websocket server
 *
 * TODO: add security policies
 */
function verifyClient(info, callback) {

  var verified = false;

  var criteria = {
    secure  : info.secure,
    origin  : info.origin,
    headers : info.req.headers
  };

  // needs to secure to be set to 'true'
  // check origin whitelist
  // check additional security headers

  verified = true;

  callback(verified);
}
