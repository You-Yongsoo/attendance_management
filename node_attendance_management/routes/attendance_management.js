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

var router = express.Router();
var calendar = new node_calendar();
var Schema = mongoose.Schema;


router.get('/', authenticate.auth, function(req, res, next) {    
    var datetime = new Date();

    var present_year = datetime.getFullYear();
    var present_month = ('00'+(datetime.getMonth()+1)).slice(-2);
    var redirect_date = present_year.toString()+'_'+present_month.toString();
    
    res.redirect('/attendance_management/'+redirect_date);
    
});

router.get('/:id', authenticate.auth, function(req, res, next){
    var employeeInfo, employeePrivacy;
    var userAgent = req.headers['user-agent'].toLowerCase();
    var userName = req.user.username;
    var id = req.params.id;
    var id_split = id.split('_');
    var present_year = id_split[0];
    var present_month = id_split[1];
    
    if(id_split.length != 2 ||
        !isYear(present_year) || !isMonth(present_month)){
        //res.render("")
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    var isFindFinishedInfo = false;
    var isFindFinishedPrivacy = false;
    
    // var attendances_model = mongoose.model('Attendances', new Schema({
    //     mail:{type:String, require:true, unique:true},
    //     date:{type:Date, require:true},
    //     start_time:{type:Date, require:true},
    //     end_time:{type:Date, require:true},
    //     message:{type:String, require:true}
    // }, {collection:'attendances_'+present_year.toString()+present_month.toString()}));

    var last_date = new Date(present_year, present_month, 0).getDate();    
    
    EmployeeInfo.find({"mail":userName}, function(err, result){
        isFindFinishedInfo = true;
        console.log("Find EmployeeInfo Result Code:"+err);
        if(result.length > 0){
            employeeInfo = result[0];
            console.log('Employee Information:'+employeeInfo);
        }
        renderView();
    });
    
    EmployeePrivacy.find({"mail":userName}, function(err, result){
        isFindFinishedPrivacy = true;
        console.log("Find EmployeePrivacyInfo Result Code:"+err);  
        if(result.length > 0){
            employeePrivacy = result[0];            
            console.log('Employee Privacy Information:'+employeeInfo);
        }
        renderView();
    });

    db_helper.collection("attendances_201810").find({}, function(err, result){
        console.log(result);
    });

    function renderView(){
        if(isFindFinishedInfo && isFindFinishedPrivacy){
            console.log("Id:"+id);
            console.log("Id Split:"+id_split.toString());
            console.log('User Agent:'+userAgent);
            console.log('UserName:'+userName);
            if(employeeInfo != undefined || employeePrivacy != undefined){
                res.render('attendance_management', {employee_info:employeeInfo, employee_privacy:employeePrivacy, 
                    year:present_year, month:present_month, lastDate:last_date});
            }  
        }           
    }
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

function redirectDateToString(str, delim){
    var arr = str.split(delim);
}

async function findEmployeeInfo(userName, employeeInfo){    
    // EmployeeInfo.find({"mail":userName}).exec().then(function(result){
    //     // console.log("Find EmployeeInfo Result Code:"+err);
    //     if(result.length > 0){
    //         employeeInfo = result[0];
    //         console.log('Employee Information:'+employeeInfo);
    //     }
    // });
    // var process_result = await EmployeeInfo.find({"mail":userName}, await function(err, result){
    //     console.log("Find EmployeeInfo Result Code:"+err);
    //     if(result.length > 0){
    //         employeeInfo = result[0];
    //         console.log('Employee Information:'+employeeInfo);
    //     }
    // });
    // return process_result;
    EmployeeInfo.find({"mail":userName}, function(err, result){
        console.log("Find EmployeeInfo Result Code:"+err);
        if(result.length > 0){
            employeeInfo = result[0];
            console.log('Employee Information:'+employeeInfo);
        }
    });
}

async function findEmployeePrivacy(userName, employeePrivacy){  
    // EmployeePrivacy.find({"mail":userName}).exec(function(err, result){
    //     console.log("Find EmployeePrivacyInfo Result Code:"+err);  
    //     if(result.length > 0){
    //         employeePrivacy = result[0];
    //         console.log('Employee Privacy Info:'+employeePrivacy);
    //     }
    // }); 
    EmployeePrivacy.find({"mail":userName}, function(err, result){
        console.log("Find EmployeePrivacyInfo Result Code:"+err);  
        if(result.length > 0){
            employeePrivacy = result[0];
            console.log('Employee Privacy Info:'+employeePrivacy);
        }
    });
    
    // var process_result = await EmployeePrivacy.find({"mail":userName}, await function(err, result){
    //     console.log("Find EmployeePrivacyInfo Result Code:"+err);  
    //     if(result.length > 0){
    //         employeePrivacy = result[0];
    //         console.log('Employee Privacy Info:'+employeePrivacy);
    //     }
    // });
}

function isYear(value){
    var pattern = /^[0-9]{4}/;
    var result = false;

    if(value == undefined){
        return result;
    }

    result = isFinite(value)
    if(!result){
        return result;
    }

    result = pattern.test(value);
    if(result){
        if(value < 2000){
            result = false;
        }
    }
    return result;
}

function isMonth(value){
    var pattern = /^[0-9]{2}/;
    var result = false;

    if(value == undefined){
        return result;
    }

    result = isFinite(value)
    if(!result){
        return result;
    }

    result = pattern.test(value);
    if(result){
        if(value < 0 || value > 12){
            result = false;
        }
    }
    return result;

}
module.exports = router;
