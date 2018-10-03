var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privacySchema = new Schema({
    mail:{type:String, require:true, unique:true},
    name:{type:String, require:true},
    birthday:{type:Date, require:true},
    address:{type:String, require:true},
    phone_number:{type:String, require:true},
    hiredate:{type:Date, require:true}
}, {collection:'employees_privacy'});

module.exports = mongoose.model('EmployeePrivacy', privacySchema); 