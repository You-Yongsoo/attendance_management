var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var department_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    department:{type:String, require:true}
}, {collection:'departments'})

module.exports = mongoose.model('CompanyDepartment', department_schema); 