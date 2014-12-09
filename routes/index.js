var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('./pages/index', {title:'Express'});
});

router.get('/test', function(req, res) {
  res.render('./pages/test', {title:'SuperSonic Testing Page'});
});


module.exports = router;
