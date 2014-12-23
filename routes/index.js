var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('./pages/index', {title:'Express'});
});

router.get('/painter', function(req, res) {
  res.render('./pages/Painter', {title:'SuperSonic Painter Testing Page'});
});

router.get('/guitar', function(req, res) {
  res.render('./pages/guitar', {title:'guitar Testing Page'});
});

router.get('/Oscillator', function(req, res) {
  res.render('./pages/Oscillator', {title:'Oscillator'});
});


module.exports = router;
