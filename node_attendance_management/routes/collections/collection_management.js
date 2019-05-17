var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../auth/authenticate');
var app = express();

var AttendanceState = require('../../models/AttendanceState');
var CompanyClass = require('../../models/CompanyClass');
var CompanyDepartment = require('../../models/CompanyDepartment');
var DispatchPlace = require('../../models/DispatchPlace');
var Authorities = require('../../models/Authorities');

var EmployeePrivacy = require('../../models/EmployeePrivacy');
var EmployeeInfo = require('../../models/EmployeeInfo');

//Attendance States
app.get('/attendanceState', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var attendanceStates;
    AttendanceState.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            attendanceStates = result;
            console.log(attendanceStates);
        }
        res.render('./collection_layout/attendanceState', {
            attendanceStates:attendanceStates
        });
    }); 
});

app.post('/attendanceState/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;
    console.log(body['id']);

    if(body['id'] == undefined || body['id'] == ''){
        
    }else{

    }    
});

app.post('/attendanceState/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;
    console.log(body['id']);

    AttendanceState.remove({_id:body['id']}).exec(function(err, result){
        res.send(result);
    });
});

//Company Class
app.get('/companyClass', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var companyClasses;
    CompanyClass.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            companyClasses = result;
            console.log(companyClasses);
        }
        res.render('./collection_layout/companyClass', {
            companyClasses:companyClasses
        });
    });    
});

app.post('/companyClass/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;
    console.log(body['id']);
    
    if(body['id'] == undefined || body['id'] == ''){
        
    }else{

    }    
});

app.post('/companyClass/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    CompanyClass.remove({_id:body['id']}).exec(function(err, result){
        res.send(result);
    });    
});

//Company Department
app.get('/companyDepartment', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var companyDepartments;
    CompanyDepartment.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            companyDepartments = result;
            console.log(companyDepartments);
        }
        res.render('./collection_layout/companyDepartment', {
            companyDepartments:companyDepartments
        });
    });
});

app.post('/companyDepartment/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;

    if(body['id'] == undefined || body['id'] == ''){
        
    }else{

    }    
});

app.post('/companyDepartment/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;
    CompanyDepartment.remove({_id:body['id']}).exec(function(err, result){
        res.send(result);
    });
});

//Dispatch Place
app.get('/dispatchPlace', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var dispatchPlaces;
    DispatchPlace.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            dispatchPlaces = result;
            console.log(dispatchPlaces);
        }
        res.render('./collection_layout/dispatchPlace', {
            dispatchPlaces:dispatchPlaces
        });
    });
});

app.post('/dispatchPlace/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;

    if(body['id'] == undefined || body['id'] == ''){
        
    }else{

    }    
});

app.post('/dispatchPlace/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;
    DispatchPlace.remove({_id:body['id']}).exec(function(err, result){
        res.send(result);
    });
});

//Employee Privacy
app.get('/employeePrivacy', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var employeePrivacyInfos;
    EmployeePrivacy.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            employeePrivacyInfos = result;
            console.log(employeePrivacyInfos);
        }
        res.render('./collection_layout/employeePrivacy', {
            employeePrivacyInfos:employeePrivacyInfos
        });
    });
});

app.post('/employeePrivacy/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;

    EmployeePrivacy.update({mail:body['mail']}, {mail:body['mail'], name:body['name'], birtyday:body['birthday'], address:body['address'], phone_number:body['phone_number'], hiredate:body['hiredate']}, {upsert:true}).exec(function(err, result){
        if(err){
            
        }else{
            res.send(result);
        }
    });
});

app.post('/employeePrivacy/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var body = req.body;

    EmployeePrivacy.remove({_id:ObjectId(body['id']), mail:body['mail']}).exec(function(err, result){
        if(err){
            
        }
        res.send(result);
    });
});

//Employee Info
app.get('/employeeInfo', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var companyDepartments, companyClasses, authorities, dispatchPlaces;
    var employeeInfos;
    CompanyDepartment.find({}).exec(function(err, result){
        if(err){
            return;
        }
        if(result.length > 0){
            companyDepartments = result;
        }
        CompanyClass.find({}).exec(function(err, result){
            if(err){
                return;
            }
            if(result.length > 0){
                companyClasses = result;
            }
            Authorities.find({}).exec(function(err, result){
                if(err){
                    return;
                }
                if(result.length > 0){
                    authorities = result;
                }
                DispatchPlace.find({}).exec(function(err, result){
                    if(err){
                        return;
                    }
                    if(result.length > 0){
                        dispatchPlaces = result;
                    }
                    EmployeeInfo.find({}).populate('department').populate('class').populate('authority').populate('dispatch').exec(function(err, result){
                        if(err){
                            res.render('./error', {message:err});
                            return;
                        }
                        if(result.length > 0){
                            employeeInfos = result;
                            console.log(employeeInfos);
                        }
                        res.render('./collection_layout/employeeInfo', {
                            departments:companyDepartments,
                            classes:companyClasses,
                            authorities:authorities,
                            dispatchPlaces:dispatchPlaces,
                            employeeInfos: employeeInfos
                        });
                    });
                });
            });
        });
    });    
});

app.post('/employeeInfo/upsert', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;

    var body = req.body;
    console.log(body['id']);
    if(body['id'] == undefined || body['id'] == ''){
        EmployeeInfo.update({mail:body['mail']}, {mail:body['mail'], department:body['department_id'], class:body['class_id'], authority:body['authority_id'], dispatch:body['dispatch_id']}, {upsert:true}).exec(function(err, result){
            if(err){
            
            }else{
                res.send(result);
            }
        });
    }else{
        EmployeeInfo.update({_id:mongoose.mongo.ObjectId(body['id'])}, {_id:mongoose.mongo.ObjectId(body['id']), mail:body['mail'], department:body['department_id'], class:body['class_id'], authority:body['authority_id'], dispatch:body['dispatch_id']}, {upsert:true}).exec(function(err, result){
            if(err){
            
            }else{
                res.send(result);
            }
        });
    }    
});

app.post('/employeeInfo/delete', authenticate.auth, function(req, res, next) {
    var userName = req.user._json.preferred_username;
    var data = req.data;
    console.log(data);
    // EmployeeInfo.find({mail:userName}).populate('authority').exec(function(err, result){
    //     if(result.length > 0){
            
    //     }
    //     console.log(result);
    // });
    
    EmployeeInfo.remove({_id:mongoose.mongo.ObjectId(body['id']), mail:body['mail']}).exec(function(err, result){
        res.send(result);
    });
});

module.exports = app;
