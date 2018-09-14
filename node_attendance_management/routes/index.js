var express = require('express');
var authenticate = require('./auth/authenticate');
var router = express.Router();

/* GET home page. */
router.get('/', authenticate.auth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
