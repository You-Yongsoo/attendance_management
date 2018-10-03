var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var infoSchema = new Schema({
    mail:{type:String, require:true, unique:true},
    department_id:{type:Schema.Types.ObjectId, require:true},
    class_id:{type:Schema.Types.ObjectId, require:true},
    authority_id:{type:Schema.Types.ObjectId, require:true},
    dispatch_id:{type:Schema.Types.ObjectId, require:true}
}, {collection:'employees_information'});

module.exports = mongoose.model('EmployeeInfo', infoSchema); 