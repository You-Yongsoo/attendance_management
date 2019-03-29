var log4js = require('log4js');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({
  name: 'Attendance Management Application'
});

// log4js.configure({
//     appenders:[
//         {
//             "type": "dateFile",
//             "category": "request",
//             "filename": "./logs/attendances.log",
//             "pattern": "-yyyy-MM-dd"
//         },
//         {
//             "type": "dateFile",
//             "category": "console",
//             "filename": "./logs/attendances.log",
//             "pattern": "-yyyy-MM-dd"
//         }
//     ],
//     //出力するログレベル設定（FATAL,ERROR,WARN,INFO,DEBUG,TRACE）
//     'levels':{'console':'INFO'}
// });

// exports.request = log4js.getLogger('request');
// exports.console = log4js.getLogger('console');
exports.log = logger;