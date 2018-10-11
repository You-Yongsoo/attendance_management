var mongoose = require('mongoose');
var schema = mongoose.Schema;

var state_schema = new schema({
    id:{type:String, require:true, unique:true},
    state:{type:String, require:true}
}, {collection:'attendance_states'})

module.exports = mongoose.model('AttendanceState', state_schema); 