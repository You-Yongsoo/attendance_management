var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    mail:{type:String, require:true, unique:true},
    date:{type:Date, require:true},
    start_time:{type:Date, require:true},
    end_time:{type:Date, require:true},
    message:{type:String, require:true}
});

module.exports = mongoose.model('Attendances', attendanceSchema); 