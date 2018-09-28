var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
var mongoose = require('mongoose');

var users = require('./database/db_users');
var User = require('../models/User');
var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');

var router = express.Router();
var calendar = new node_calendar();

router.get('/', authenticate.auth, function(req, res, next) {    
    var datetime = new Date();

    var present_year = datetime.getFullYear();
    var present_month = ('00'+(datetime.getMonth()+1)).slice(-2);
    var redirect_date = present_year.toString()+'_'+present_month.toString();
    
    res.redirect('/attendance_management/'+redirect_date);
});

router.get('/:id', authenticate.auth, function(req, res, next){
    // users.find(username).then(function(rows){

    // });
    var userAgent = req.headers['user-agent'].toLowerCase();
    var username = req.user.username;
    var id = req.params.id;
    var employeeInfo, employeePrivacy;
    var id_split = id.split('_');
    var present_year = id_split[0];
    var present_month = id_split[1];
    var last_date = new Date(present_year, present_month, 0).getDate();
    EmployeeInfo.find({"mail":username}, findEmployeeInfo);
    EmployeePrivacy.find({"mail":username}, findEmployeePrivacy);
    
    console.log("Id:"+id);
    console.log("Id Split:"+id_split.toString());
    console.log('User Agent:'+userAgent);
    console.log('UserName:'+req.user.username);    
    
    res.render('attendance_management', {year:present_year, month:present_month, lastDate:last_date});
});

function redirectDateToString(str, delim){
    var arr = str.split(delim);

}

function findEmployeeInfo(err, result){
    console.log('Employee Information:'+result[0]);
}

function findEmployeePrivacy(err, result){
    console.log('Employee Privacy Info:'+result[0]);
}
module.exports = router;
