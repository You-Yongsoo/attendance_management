var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
var mongoose = require('mongoose');
var async = require('async');

var users = require('./database/db_users');
var User = require('../models/User');
var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');
var Attendances = require('../models/Attendances');
var db_helper = require('./database/db_helper');
var DateChecker = require('./util/DateChecker');

var router = express.Router();
var calendar = new node_calendar();
var Schema = mongoose.Schema;


//URL最後尾にパラメータ情報がなければ、接続した日付の年月をパラメータに追加、
//追加したパラメータのURLにリダイレクト
router.get('/', authenticate.auth, function(req, res, next) {    
    var datetime = new Date();

    var present_year = datetime.getFullYear();
    var present_month = ('00'+(datetime.getMonth()+1)).slice(-2);
    var redirect_date = present_year.toString()+'_'+present_month.toString();
    
    res.redirect('/attendance_management/'+redirect_date);
});

router.get('/:id', authenticate.auth, function(req, res, next){
    var id = req.params.id;
    var id_split = id.split('_');
    var present_year = id_split[0];
    var present_month = id_split[1];
    
    if(id_split.length != 2 ||
        !DateChecker.isYear(present_year) || !DateChecker.isMonth(present_month)){
        //res.render("")
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    
    var employeeInfo, employeePrivacy, attendances;
    var userAgent = req.headers['user-agent'].toLowerCase();
    var userName = req.user.username;

    var last_date = new Date(present_year, present_month, 0).getDate();

    var isFindFinishedInfo = false;
    var isFindFinishedPrivacy = false;
    var isFindFinishedAttendances = false;

    var attendances_col_name = 'attendances_'+present_year+''+present_month;
    
    //社員公開情報を抽出
    // EmployeeInfo.find({"mail":userName}, function(err, result){
    //     isFindFinishedInfo = true;
    //     console.log("Find EmployeeInfo Result Code:"+err);
    //     if(result.length > 0){
    //         employeeInfo = result[0];
    //         console.log('Employee Information:'+employeeInfo);
    //     }
    //     renderView();
    // });
    EmployeeInfo.find({"mail":userName})
        .populate('department_id')
        .populate('class_id')
        .populate('dispatch_id')
        .exec(function(err, result){
            if(err) throw new Error(err);
            isFindFinishedInfo = true;
            console.log("Merge Result:"+result);
            if(result.length > 0){
                employeeInfo = result[0];
            }
            renderView();
        });

    
    //社員個人情報を抽出
    EmployeePrivacy.find({"mail":userName}, function(err, result){
        isFindFinishedPrivacy = true;
        console.log("Find EmployeePrivacyInfo Result Code:"+err);  
        if(result.length > 0){
            employeePrivacy = result[0];            
            console.log('Employee Privacy Information:'+employeeInfo);
        }
        renderView();
    });

    //
    db_helper.collection(attendances_col_name).find({}).toArray(function(err, result){
        isFindFinishedAttendances = true;
        console.log(result);
        if(result.length > 0){
            attendances = result;
            console.log('Employee Attendances:'+attendances);
        }
        renderView();
    });

    function renderView(){
        if(isFindFinishedInfo && isFindFinishedPrivacy && isFindFinishedAttendances){
            console.log("Id:"+id);
            console.log("Id Split:"+id_split.toString());
            console.log('User Agent:'+userAgent);
            console.log('UserName:'+userName);
            if(employeeInfo != undefined || employeePrivacy != undefined || attendances != undefined){
                res.render('attendance_management', 
                {
                    employee_info:employeeInfo, 
                    employee_privacy:employeePrivacy, 
                    attendances:attendances, 
                    year:present_year, 
                    month:present_month, 
                    lastDate:last_date
                });
            }  
        }           
    }
});

router.put('/:id', authenticate.auth, function(req, res, next){
    
});

router.post('/:id', authenticate.auth, function(req, res, next){
    var id = req.params.id;
    var id_split = id.split('_');
    var present_year = id_split[0];
    var present_month = id_split[1];
    
    if(id_split.length != 2 ||
        !DateChecker.isYear(present_year) || !DateChecker.isMonth(present_month)){
        //res.render("")
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }

    var redirectUrl = '/attendance_management/'+present_year+'_'+present_month

    console.log(req.body.attendance_form);
    console.log('Attendance Management Post');
    res.redirect(redirectUrl);
});

// function findEmployeeInfo(userName, employeeInfo){
//     if(result.length > 0){
//         employeeInfo = result[0];
//         console.log('Employee Information:'+employeeInfo);
//     }
// }

// function findEmployeePrivacy(userName, employeePrivacy){
//     if(result.length > 0){
//         employeePrivacy = result[0];
//         console.log('Employee Privacy Info:'+employeePrivacy);
//     }
// }

// function redirectDateToString(str, delim){
//     var arr = str.split(delim);
// }

// async function findEmployeeInfo(userName, employeeInfo){    
//     // EmployeeInfo.find({"mail":userName}).exec().then(function(result){
//     //     // console.log("Find EmployeeInfo Result Code:"+err);
//     //     if(result.length > 0){
//     //         employeeInfo = result[0];
//     //         console.log('Employee Information:'+employeeInfo);
//     //     }
//     // });
//     // var process_result = await EmployeeInfo.find({"mail":userName}, await function(err, result){
//     //     console.log("Find EmployeeInfo Result Code:"+err);
//     //     if(result.length > 0){
//     //         employeeInfo = result[0];
//     //         console.log('Employee Information:'+employeeInfo);
//     //     }
//     // });
//     // return process_result;
//     EmployeeInfo.find({"mail":userName}, function(err, result){
//         console.log("Find EmployeeInfo Result Code:"+err);
//         if(result.length > 0){
//             employeeInfo = result[0];
//             console.log('Employee Information:'+employeeInfo);
//         }
//     });
// }

// async function findEmployeePrivacy(userName, employeePrivacy){  
//     // EmployeePrivacy.find({"mail":userName}).exec(function(err, result){
//     //     console.log("Find EmployeePrivacyInfo Result Code:"+err);  
//     //     if(result.length > 0){
//     //         employeePrivacy = result[0];
//     //         console.log('Employee Privacy Info:'+employeePrivacy);
//     //     }
//     // }); 
//     EmployeePrivacy.find({"mail":userName}, function(err, result){
//         console.log("Find EmployeePrivacyInfo Result Code:"+err);  
//         if(result.length > 0){
//             employeePrivacy = result[0];
//             console.log('Employee Privacy Info:'+employeePrivacy);
//         }
//     });
    
//     // var process_result = await EmployeePrivacy.find({"mail":userName}, await function(err, result){
//     //     console.log("Find EmployeePrivacyInfo Result Code:"+err);  
//     //     if(result.length > 0){
//     //         employeePrivacy = result[0];
//     //         console.log('Employee Privacy Info:'+employeePrivacy);
//     //     }
//     // });
// }

module.exports = router;
