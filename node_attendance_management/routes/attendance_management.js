var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
//var date_utils = require('date-utils');
var mongoose = require('mongoose');

var User = require('../models/User');
var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');

var router = express.Router();
var calendar = new node_calendar();

router.get('/', authenticate.auth, function(req, res, next) {
    var userAgent = req.headers['user-agent'].toLowerCase();
    var username = req.user.username;
    //var date = new date_utils();
    console.log('User Agent:'+userAgent);
    console.log('UserName:'+req.user.username);
    //console.log('Date:'+date);

    EmployeeInfo.find({"mail":username}, function(err, result){
        console.log('Employee Information:'+result[0]);
    });

    EmployeePrivacy.find({"mail":username}, function(err, result){
        console.log('Employee Privacy Info:'+result[0]);
    });
    
    res.render('attendance_management');
});

module.exports = router;
