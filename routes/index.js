var express = require('express');
var router = express.Router();

var pjson = require('../package');

router.get('/', function(req, res, next) {
  res.json({
    'name'    : pjson.name,
    'version' : pjson.version,
    'healthy' : true
  });
});

module.exports = router;
