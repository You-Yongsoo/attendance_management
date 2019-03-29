var express = require('express');
var authenticate = require('../auth/authenticate');
var app = express();
var router = express.Router();
var passport = require('passport');

/* GET home page. */
app.get('/', authenticate.auth, function(req, res) {  
  var userAgent = req.headers['user-agent'].toLowerCase();
  console.log('User Agent:'+userAgent);
  console.log(req.user._json.preferred_username);
  
  res.render('./employee_layout/employee_menu');
});

module.exports = app;
