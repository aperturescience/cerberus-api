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

    if (res.statusCode !== 200)
      console.warn('not ok', res.statusCode);

    if (err)
      throw err;
  });
};

module.exports = new Influx({
  host : '54.93.177.111',
  ssl  : false
});