var express = require('express');
var authenticate = require('../auth/authenticate');
var app = express();
var router = express.Router();
var passport = require('passport');
var EmployeeInfo = require('../../models/EmployeeInfo');
var log = require('../util/LogHelper').log;

/* GET home page. */
app.get('/', authenticate.auth, function(req, res) {  
  var userAgent = req.headers['user-agent'].toLowerCase();
  var userName = req.user._json.preferred_username;
  console.log('User Agent:'+userAgent);
  console.log('User:'+userName);
  
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
    
    var user_authority = employeeInfo.authority.authority_value;
    log.info("権限:"+user_authority);
    if(user_authority == 'ROLE_EMPLOYEE'){
      res.render('./menu_layout/employee_menu');
    }else if(user_authority == 'ROLE_MANAGER'){
      res.render('./menu_layout/manager_menu');
    }else if(user_authority == 'ROLE_ADMIN'){
      res.render('./menu_layout/admin_menu');
    }else{
      res.render('./menu_layout/employee_menu');
    }    
  });
});

module.exports = app;
