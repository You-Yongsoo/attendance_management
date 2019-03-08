var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//ObjectIdのタイプ:Schema.Types.ObjectId
var infoSchema = new Schema({
    mail:{type:String, require:true, unique:true},
    department_id:{type:Number, require:true, ref:'CompanyDepartment'},
    class_id:{type:Number, require:true, ref:'CompanyClass'},
    authority_id:{type:Number, require:true},
    dispatch_id:{type:Number, require:true, ref:'DispatchPlace'}
}, {collection:'employees_information'});

module.exports = mongoose.model('EmployeeInfo', infoSchema); 