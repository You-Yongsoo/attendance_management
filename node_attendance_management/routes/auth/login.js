var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var passport_local = require('passport-local');
// var passport_azure = require('passport-azure-ad');

var User = require('../../models/User');

//var router = express.Router();
var app = express();
var LocalStrategy = passport_local.Strategy;

app.use(bodyParser.urlencoded({extended:true}));

passport.use('local', new LocalStrategy(function(username, password, done){
    console.log("Catch the post request");
    
    // パラメータ名、usernameとpassを出力
    console.log(username);
    console.log(password);
    
    User.find({ "username" : username }, function(err, result){
        if (err){
            console.log(err);
        }

        if (result.length == 0){
            //return done('アカウントが存在しません');
            console.log('アカウントが存在しない');
            return done(null, false, {login_result:'アカウントが存在しない'});
        }
        // usernameがDBに存在した場合
        else{
            if (result[0].password == password){
                console.log('アカウント存在');
                var user = new User();
                user.username = username;
                user.password = password;

                return done(null, user);
            }
            else{
                console.log('ユーザIDとパスワード一致しない');
                return done(null, false);
            }
        }
    });
}));

passport.serializeUser(function(user, done){
    console.log('SerializeUser:'+user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    console.log('DeserializeUser:'+user.username);
    done(null, user);
});

app.get('/', function(req, res){
    var userAgent = req.headers['user-agent'].toLowerCase();
    console.log('User Agent:'+userAgent);
    res.render('login', {title:'Login', login_result:'ログインしてください'});
});

app.get('/err', function(req, res){
    var userAgent = req.headers['user-agent'].toLowerCase();
    console.log('User Agent:'+userAgent);
    res.render('login', {title:'Login', login_result:'ログイン失敗'});
});

app.post('/callback', 
    passport.authenticate('saml', {
        failureRedirect:'/', 
        failureFlash:true,
    }),
    function(req, res){
        res.redirect('/employee_menu');
    }
);

//----------------------------------------------------------
//参照
//https://qiita.com/tinymouse/items/fa910bf80a038c7f9ccb
//---------------------------------------------------------
app.post('/', 
    passport.authenticate('local', {
        failureRedirect:'/login/err', 
        failureFlash:false,
    }),
    function(req, res){
        res.redirect('/employee_menu');
    }
);

module.exports = app;