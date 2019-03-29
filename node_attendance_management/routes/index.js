var express = require('express');
var authenticate = require('./auth/authenticate');
var passport = require('passport');
var router = express.Router();
var app = express();

/* GET home page. */
app.get('/', authenticate.auth, function(req, res) {
    res.render('index', {title:'Express'});
});

module.exports = app;
