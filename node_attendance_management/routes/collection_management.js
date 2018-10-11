var express = require('express');
var authenticate = require('./auth/authenticate');
var router = express.Router();

var AttendanceState = require('../models/AttendanceState');
var CompanyClass = require('../models/CompanyClass');
var CompanyDepartment = require('../models/CompanyDepartment');
var DispatchPlace = require('../models/DispatchPlace');

var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');

/* GET home page. */
router.get('/', authenticate.auth, function(req, res, next) {
    AttendanceState.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });

    CompanyClass.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });

    CompanyDepartment.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });

    DispatchPlace.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });

    EmployeePrivacy.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });

    EmployeeInfo.find({}, function(err, result){
        if(result.length > 0){
            console.log(result);
        }
    });
    
    res.render('collection_management');
});

module.exports = router;
