var config          = require('./config.json');
var WebSocketServer = require('ws').Server;

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

    ws.on('message', function(message) {
      console.log('received: %s', message);
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
