var express = require('express');
var authenticate = require('../auth/authenticate');
var app = express();
var router = express.Router();

var log = require('../util/LogHelper').log;
var EmployeeInfo = require('../../models/EmployeeInfo');

/* GET home page. */

app.get('/', authenticate.auth, function(req, res) {  
  var userAgent = req.headers['user-agent'].toLowerCase();
  var userName = req.user._json.preferred_username;
  var employeeInfo;
  
  EmployeeInfo.find({"mail": userName }).populate('authority').exec(function (err, result) {
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
    console.log('User Agent:'+userAgent);
    console.log('User Name:'+userName);
    
    if(user_authority == 'ROLE_ADMIN'){
      res.render('./collection_menu');
    }else{
      res.redirect('/employee_menu');
    }
  });
});

module.exports = app;
