var request = require('request'),
    _       = require('lodash-node');

function Influx(opts) {

  var defaults = {
    host : 'localhost',
    port : 8086,
    ssl  : false
  };

  _.assign(defaults, opts);
  _.assign(this, defaults);

  this._scheme   = this.ssl ? 'https://' : 'http://';
  this._writeUrl = this._scheme + this.host + ':' + this.port + '/write';

}

Influx.prototype.write = function(data) {
  var self = this;

  request({
    method : 'POST',
    url    : self._writeUrl,
    json   : true,
    body   : data
  }, function(err, res, body) {

    if (err)
      throw err;

    if (res.statusCode !== 200)
      console.warn('not ok', res.statusCode);

  });
};

module.exports = new Influx({
  host : '127.0.0.1',
  ssl  : false
});