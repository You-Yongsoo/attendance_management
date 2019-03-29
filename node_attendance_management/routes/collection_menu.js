var express = require('express');
var authenticate = require('./auth/authenticate');
var app = express();
var router = express.Router();

/* GET home page. */

app.get('/', authenticate.auth, function(req, res) {  
  var userAgent = req.headers['user-agent'].toLowerCase();
  var userName = req.user._json.preferred_username;
  console.log('User Agent:'+userAgent);
  console.log('User Name:'+userName);
  
  res.render('./collection_menu');
});

module.exports = app;
