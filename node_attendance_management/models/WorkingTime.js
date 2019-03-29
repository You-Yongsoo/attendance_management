var mongoose = require('mongoose');
var schema = mongoose.Schema;

var working_time_schema = new schema({
    // _id:{type:Number, require:true, unique:true},    
    mail:{type:String, require:true, unique:true},
    start_time:{type:String, require:true},
    end_time:{type:String, require:true}
}, {collection:'working_times'})

module.exports = mongoose.model('WorkingTime', working_time_schema); 