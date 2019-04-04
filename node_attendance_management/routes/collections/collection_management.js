var express = require('express');
var authenticate = require('../auth/authenticate');
var app = express();

var AttendanceState = require('../../models/AttendanceState');
var CompanyClass = require('../../models/CompanyClass');
var CompanyDepartment = require('../../models/CompanyDepartment');
var DispatchPlace = require('../../models/DispatchPlace');

var EmployeePrivacy = require('../../models/EmployeePrivacy');
var EmployeeInfo = require('../../models/EmployeeInfo');

/* GET home page. */
app.get('/attendanceState', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    AttendanceState.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
        
        res.render('collection_management');
    }); 
});

app.get('/companyClass', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    CompanyClass.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }

    });
    
});

app.get('/companyDepartment', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    CompanyDepartment.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
});

app.get('/dispatchPlace', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    DispatchPlace.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
});

app.get('/employeePrivacy', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    EmployeePrivacy.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
    
});

app.get('/employeeInfo', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    EmployeeInfo.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
        res.render('./collections/employeeInfo');
    });
});

module.exports = app;
