var express = require('express');
var authenticate = require('../auth/authenticate');
var app = express();
var router = express.Router();

/* GET home page. */

app.get('/', authenticate.auth, function(req, res) {  
  var userAgent = req.headers['user-agent'].toLowerCase();
  console.log('User Agent:'+userAgent);
  console.log(req.user);

  
  res.render('./employee_layout/employee_menu');
});

module.exports = app;
