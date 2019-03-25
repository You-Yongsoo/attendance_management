var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var fs = require('fs');

// var passport_azure_ad = require('passport-azure-ad');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
//var bunyan = require('bunyan');
// var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/auth/login');
var employee_menu = require('./routes/employee/employee_menu');
var attendance_management = require('./routes/attendance_management');
var collection_management = require('./routes/collection_management')
var collection_menu = require('./routes/collection_menu');
var db_helper = require('./routes/database/db_helper');

var config_filepath = "./config/config.json";
var config_json = fs.readFileSync(config_filepath, 'utf-8');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//セッションミドルウェア設定
app.use(session({
  resave:false,
  saveUninitialized:true,
  secret:'softwiz',
  cookie:{
    httpOnly:false
  }
}));

//認証ミドルウェアpassportの初期化
passport.use(new OIDCStrategy({
  identityMetadata: 'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration',
  clientID:'54acf2c3-6bfd-4397-9e93-9a4629e3d6af',
  
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/employee_menu', employee_menu);
app.use('/attendance_management', attendance_management);
app.use('/collection_management', collection_management);
app.use('/collection_menu', collection_menu);

//mongoose.connect('mongodb://localhost/db_attendance_management');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;