var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userAgent = req.headers['user-agent'].toLowerCase();
  console.log('User Agent:'+userAgent);
  res.render('index', { title: 'Express' });
});

module.exports = router;
