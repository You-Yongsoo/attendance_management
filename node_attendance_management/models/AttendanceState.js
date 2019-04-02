var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var state_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    state:{type:String, require:true},
    state_value:{type:Number, require:true}
}, {collection:'attendance_states'})

module.exports = mongoose.model('AttendanceState', state_schema); 