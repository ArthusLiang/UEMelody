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

router.get('/test', function(req, res) {
  res.render('./pages/test', {title:'Test'});
});
router.get('/test2', function(req, res) {
  res.render('./pages/test2', {title:'Test2'});
});
router.get('/t', function(req, res) {
  res.render('./pages/t', {title:'t'});
});

router.get('/watch', function(req, res) {
  res.render('./pages/watch', {title:'watch'});
});
router.get('/s', function(req, res) {
  res.render('./pages/s', {title:'s'});
});
module.exports = router;
