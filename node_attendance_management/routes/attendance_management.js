var express = require('express');
var authenticate = require('./auth/authenticate');
var node_calendar = require('node-calendar');
var mongoose = require('mongoose');
var async = require('async');

var users = require('./database/db_users');
var User = require('../models/User');
var EmployeePrivacy = require('../models/EmployeePrivacy');
var EmployeeInfo = require('../models/EmployeeInfo');
var AttendanceState = require('../models/AttendanceState');
var Authority = require('../models/Authorities');
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
        //res.render("")
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }

    var attendanceStates;
    var employeeInfo, employeePrivacy, attendances;
    var userAgent = req.headers['user-agent'].toLowerCase();
    //var userName = req.user.username;
    var userName = req.user._json.preferred_username;

    var lastDate = new Date(presentYear, presentMonth, 0).getDate();

    var isFindFinishedInfo = false;
    var isFindFinishedPrivacy = false;
    var isFindFinishedAttendances = false;

    var attendances_col_name = 'attendances_' + presentYear + '' + presentMonth;
    
    

    AttendanceState.find({}).exec(function (err, result) {
        if (err) throw new Error(err);
        if (result.length > 0) {
            attendanceStates = result;
            for(var i = 0; i < attendanceStates.length; i++){
                console.log(attendanceStates[i]);
            }
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

                db_helper.collection(attendances_col_name).find({ "mail": userName }).sort({ date: -1 }).toArray(function (err, result) {
                    if (result.length > 0) {
                        attendances = result;
                        console.log('Attendance Size:' + attendances.length);
                    }
                    renderView();
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
    
    var attendances_col_name = 'attendances_' + presentYear + '' + presentMonth;
    var redirectUrl = '/attendance_management/' + presentYear + '_' + presentMonth

    //参考資料
    // スキーマ定義などなど
    // article = mongoose.model('article', schema);
    // mongoose.connect('mongodb://localhost:27017/hogetable', function(err) {});
    // article.update({id: XXX}, item, {upsert: true}, function(err) {});

    log.info('Attendance Management Post');
    log.info(req.body);

    // db_helper.collection(attendances_col_name)
    
    res.redirect(redirectUrl);
});

module.exports = router;
