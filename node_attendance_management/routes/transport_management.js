var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
var mongoose = require('mongoose');
var async = require('async');
var date_utils = require('date-utils');

var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');
var AttendanceState = require('../models/AttendanceState');
var AttendanceTime = require('../models/AttendanceTime');
var db_helper = require('./database/db_helper');
var DateChecker = require('./util/DateChecker');
var log = require('./util/LogHelper').log;

var router = express.Router();
var calendar = new node_calendar();
var Schema = mongoose.Schema;


//URL最後尾にパラメータ情報がなければ、接続した日付の年月をパラメータに追加、
//追加したパラメータのURLにリダイレクト
router.get('/', authenticate.auth, function (req, res, next) {
    var datetime = new Date();

    var present_year = datetime.getFullYear();
    var present_month = ('00' + (datetime.getMonth() + 1)).slice(-2);
    var redirect_date = present_year.toString() + '_' + present_month.toString();

    res.redirect('/transport_management/' + redirect_date);
});

router.get('/:id', authenticate.auth, function (req, res, next) {
    var id = req.params.id;
    var id_split = id.split('_');
    var presentYear = id_split[0];
    var presentMonth = id_split[1];

    if (id_split.length != 2 ||
        !DateChecker.isYear(presentYear) || !DateChecker.isMonth(presentMonth)) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    
    var attendanceTime, attendanceStates;
    var employeeInfo, employeePrivacy, transports;
    var userAgent = req.headers['user-agent'].toLowerCase();
    //var userName = req.user.username;
    let userName = req.user._json.preferred_username;
    let lastDate = new Date(presentYear, presentMonth, 0).getDate();
    let transports_col_name = 'trasports_' + presentYear + '' + presentMonth;    
    
    AttendanceTime.find({"year":presentYear}).exec(function(err, result){
        if (err){
            log.error(err)
            return;
        }
        if(result.length > 0){
            attendanceTime = result[0];
        }
        AttendanceState.find({}).exec(function (err, result) {
            if (err){
                log.error(err)
                return;
            }
            if (result.length > 0) {
                attendanceStates = result;
            }
            //社員基本情報を抽出
            EmployeeInfo.find({"mail": userName }).populate('department').populate('class').populate('authority').populate('dispatch').exec(function (err, result) {
                if (err){
                    log.error(err)
                    return;
                }
                if (result.length > 0) {
                    employeeInfo = result[0];
                    console.log("Employee Info:" + employeeInfo);
                }else{
                    log.info("Not exist Employee Information")
                    return;
                }
                //社員個人情報を抽出
                EmployeePrivacy.find({ "mail": userName }).exec(function (err, result) {
                    if (err){
                        log.error(err)
                        return;
                    }
                    if (result.length > 0) {
                        employeePrivacy = result[0];
                        log.info('Employee Privacy:' + employeePrivacy);
                    }else{
                        log.info("Not exist Employee Privacy Infomation")
                        return;
                    }
    
                    db_helper.collection(transports_col_name).find({ "mail": userName }).sort({ date: 1 }).toArray(function (err, result) {
                        if (result.length > 0) {
                            transports = result;
                        }
                        renderView();
                    });
                });
            });
        });
    });
    

    function renderView() {
        console.log("Id:" + id);
        console.log("Id Split:" + id_split.toString());
        console.log('User Agent:' + userAgent);
        console.log('UserName:' + userName);
        res.render('transport_management',
            {
                attendance_time: attendanceTime,
                attendance_states: attendanceStates,
                employee_info: employeeInfo,
                employee_privacy: employeePrivacy,
                transports: transports,
                year: presentYear,
                month: presentMonth,
                last_date: lastDate
            });
    }
});

router.post('/:id', authenticate.auth, function (req, res, next) {
    var id = req.params.id;
    var id_split = id.split('_');
    var presentYear = id_split[0];
    var presentMonth = id_split[1];

    if (id_split.length != 2 ||
        !DateChecker.isYear(presentYear) || !DateChecker.isMonth(presentMonth)) {
        //res.render("")
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    
    let userName = req.user._json.preferred_username;
    let transports_col_name = 'transports_' + presentYear + '' + presentMonth;
    let redirectUrl = '/transport_management/' + presentYear + '_' + presentMonth
    let lastDate = new Date(presentYear, presentMonth, 0).getDate();

    
    res.redirect(redirectUrl);    
});

module.exports = router;
