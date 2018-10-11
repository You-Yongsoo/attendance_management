var mongoose = require('mongoose');
var schema = mongoose.Schema;

var department_schema = new schema({
    id:{type:String, require:true, unique:true},
    department_name:{type:String, require:true}
}, {collection:'departments'})

module.exports = mongoose.model('CompanyDepartment', department_schema); 