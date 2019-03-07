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
    
    EmployeeInfo.find({"mail":userName})
    .populate('department_id')
    .populate('class_id')
    .populate('dispatch_id')
    .exec(function(err, result){
        if(err) throw new Error(err);
        isFindFinishedInfo = true;
        console.log("EmployeeInfo:"+result);
        if(result.length > 0){
            employeeInfo = result[0];
        }
        //社員個人情報を抽出
        EmployeePrivacy.find({"mail":userName})
        .exec(function(err, result){
            isFindFinishedPrivacy = true;
            if(err != null){
                console.log("Find EmployeePrivacyInfo Result Code:"+err);  
            }
            if(result.length > 0){
                employeePrivacy = result[0];            
                console.log('EmployeePrivacy:'+employeePrivacy);
            }

            db_helper.collection(attendances_col_name).find({"mail":userName})
            .sort({date:-1})
            .toArray(function(err, result){
                isFindFinishedAttendances = true;
                if(result.length > 0){
                    attendances = result;
                    console.log('Attendance Size:'+attendances.length);
                }
                renderView();
            });
        });
    });


    function renderView(){
        if(isFindFinishedInfo && isFindFinishedPrivacy && isFindFinishedAttendances){
            console.log("Id:"+id);
            console.log("Id Split:"+id_split.toString());
            console.log('User Agent:'+userAgent);
            console.log('UserName:'+userName);
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

module.exports = router;
