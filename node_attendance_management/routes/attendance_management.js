var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
var mongoose = require('mongoose');

var User = require('../models/User');
var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');

var router = express.Router();
var calendar = new node_calendar();

router.get('/', authenticate.auth, function(req, res, next) {    
    var datetime = new Date();

    var present_year = datetime.getFullYear();
    var present_month = ('00'+datetime.getMonth()).slice(-2);
    var redirect_date = present_year.toString()+'_'+present_month.toString();
    
    res.redirect('/attendance_management/'+redirect_date);
});

router.get('/:id', authenticate.auth, function(req, res, next){
    var userAgent = req.headers['user-agent'].toLowerCase();
    var username = req.user.username;
    var id = req.params.id;

    
    console.log("Id:"+id);
    console.log('User Agent:'+userAgent);
    console.log('UserName:'+req.user.username);    
    

    EmployeeInfo.find({"mail":username}, function(err, result){
        console.log('Employee Information:'+result[0]);
    });

    EmployeePrivacy.find({"mail":username}, function(err, result){
        console.log('Employee Privacy Info:'+result[0]);
    });

    
    
    res.render('attendance_management');
});

function redirectDateToString(str, delim){
    var arr = str.split(delim);

}
module.exports = router;
