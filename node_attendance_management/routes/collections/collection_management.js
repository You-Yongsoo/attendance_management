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
    AttendanceState.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
        
        res.render('collection_management');
    }); 
});

app.get('/companyClass', authenticate.auth, function(req, res, next) {
    CompanyClass.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }

    });
    
});

app.get('/companyDepartment', authenticate.auth, function(req, res, next) {
    CompanyDepartment.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
});

app.get('/dispatchPlace', authenticate.auth, function(req, res, next) {
    DispatchPlace.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
});

app.get('/employeePrivacy', authenticate.auth, function(req, res, next) {
    EmployeePrivacy.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
    
});

app.get('/employeeInfo', authenticate.auth, function(req, res, next) {
    EmployeeInfo.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
        res.render('./collections/employeeInfo');
    });
});






module.exports = app;
