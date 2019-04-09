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

    res.redirect('/attendance_management/' + redirect_date);
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

    // var now = new Date();
    // console.log("toLocaleString:"+now.toLocaleString());
    // console.log("LocaleDateString:"+now.toLocaleDateString());
    // console.log("LocaleTimeString:"+now.toLocaleTimeString());
    
    var attendanceTime, attendanceStates;
    var employeeInfo, employeePrivacy, attendances;
    var userAgent = req.headers['user-agent'].toLowerCase();
    //var userName = req.user.username;
    let userName = req.user._json.preferred_username;
    let lastDate = new Date(presentYear, presentMonth, 0).getDate();
    let attendances_col_name = 'attendances_' + presentYear + '' + presentMonth;    
    
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
    
                    db_helper.collection(attendances_col_name).find({ "mail": userName }).sort({ date: 1 }).toArray(function (err, result) {
                        if (result.length > 0) {
                            attendances = result;
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
        res.render('attendance_management',
            {
                attendance_time: attendanceTime,
                attendance_states: attendanceStates,
                employee_info: employeeInfo,
                employee_privacy: employeePrivacy,
                attendances: attendances,
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
    let attendances_col_name = 'attendances_' + presentYear + '' + presentMonth;
    let redirectUrl = '/attendance_management/' + presentYear + '_' + presentMonth
    let lastDate = new Date(presentYear, presentMonth, 0).getDate();

    var body = req['body'];
    for(var i = 1; i <= lastDate; i++){
        var dateLabel = 'date_'+i;
        var startTimeLabel = 'start_time_'+i;
        var endTimeLabel = 'end_time_'+i;
        var stateLabel = 'state_'+i;
        var messageLabel = 'message_'+i;

        var date = body[dateLabel];
        var startTime = body[startTimeLabel];
        var endTime = body[endTimeLabel];
        var state = body[stateLabel];
        var message = body[messageLabel];

        db_helper.collection(attendances_col_name).update({mail: userName, date:date}, {mail: userName, date:date, start_time:startTime, end_time:endTime, state:state, message:message}, {upsert:true}, function(err, commandResult){
            if(err){
                res.render('./error', {message:'Error', error:err});
                return;
            }
            console.log(commandResult.result);
        });
    }
    res.redirect(redirectUrl);    
});

module.exports = router;
