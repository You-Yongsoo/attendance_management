var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    mail:{type:String, require:true, unique:true},
    department:{type:Schema.Types.ObjectId, require:true, ref:'CompanyDepartment'},
    class:{type:Schema.Types.ObjectId, require:true, ref:'CompanyClass'},
    authority:{type:Schema.Types.ObjectId, require:true, ref:'Authority'},
    dispatch:{type:Schema.Types.ObjectId, require:true, ref:'DispatchPlace'}
}, {collection:'employees_information'});

module.exports = mongoose.model('EmployeeInfo', infoSchema); 