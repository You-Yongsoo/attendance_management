var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var times_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    year:{type:Number, require:true},
    lunch_time:{type:String, require:true},
    dinner_time:{type:String, require:true}
}, {collection:'attendance_times'})

module.exports = mongoose.model('AttendanceTime', times_schema); 