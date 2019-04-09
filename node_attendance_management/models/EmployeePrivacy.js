var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privacySchema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    mail:{type:String, require:true, unique:true},
    name:{type:String, require:true},
    birthday:{type:String, require:true},
    address:{type:String, require:true},
    phone_number:{type:String, require:true},
    hiredate:{type:String, require:true}
}, {collection:'employees_privacy'});

module.exports = mongoose.model('EmployeePrivacy', privacySchema); 