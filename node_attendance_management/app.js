var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var db_helper = require('./routes/database/db_helper');
//var passport_azure_ad = require('passport-azure-ad');
//var bunyan = require('bunyan');
// var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/auth/login');
var employee_menu = require('./routes/employee/employee_menu');
var attendance_management = require('./routes/attendance_management');
var collection_management = require('./routes/collection_management')
var collection_menu = require('./routes/collection_menu');

var app = express();
//var OIDCStrategy = passport_azure_ad.OIDCStrategy;
// var log = bunyan.createLogger({
//   name:'Microsoft OIDC Web Application'
// });

/*
// passport.use(new OIDCStrategy({
//   //OAUTH 2.0 トークン エンドポイント
//   identityMetadata: 'https://login.microsoftonline.com/fd43a157-8308-4b5f-9ed9-81ba7c87b966/.well-known/openid-configuration',
//   //アプリケーションID
//   clientID: '54acf2c3-6bfd-4397-9e93-9a4629e3d6af',
//   clientSecret: 'usrfaYUEiQ1/6Q1bhfRG85GmgJUhlpOVoGlqKRDiKyg=',
//   responseType: 'id_token',
//   responseMode: 'form_post',
//   redirectUrl: 'https://localhost:3000/',
//   scope:'openid'
//   // allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
//   // validateIssuer: config.creds.validateIssuer,
//   // isB2C: config.creds.isB2C,
//   // issuer: config.creds.issuer,
//   // passReqToCallback: config.creds.passReqToCallback,
//   // scope: config.creds.scope,
//   // loggingLevel: config.creds.loggingLevel,
//   // nonceLifetime: config.creds.nonceLifetime,
//   // nonceMaxAmount: config.creds.nonceMaxAmount,
//   // useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
//   // cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
//   // clockSkew: config.creds.clockSkew,
// },
// function(iss, sub, profile, accessToken, refreshToken, done) {
//   if (!profile.oid) {
//     return done(new Error("No oid found"), null);
//   }
//   // asynchronous verification, for effect...
//   process.nextTick(function () {
//     findByOid(profile.oid, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         // "Auto-registration"
//         users.push(profile);
//         return done(null, profile);
//       }
//       return done(null, user);
//     });
//   });
// }
// ));
*/



// //mongoose
// mongoose.connect('mongodb://localhost/db_attendance_management');

// mongoose.connection.on('connected', function(){
//   console.log('DB Connected');
//   is_connected_db = true;
// });

// mongoose.connection.on( 'error', function(err){
//   console.log( 'Failed to connect a mongo db : ' + err );
// });

// // mongoose.disconnect() を実行すると、disconnected => close の順番でコールされる
// mongoose.connection.on( 'disconnected', function(){
//   console.log( 'DB Disconnected.' );
// });

// mongoose.connection.on( 'close', function(){
//   console.log( 'DB Connection closed.' );
// });

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
}));

//認証ミドルウェアpassportの初期化
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