var mongoose = require('mongoose');
var schema = mongoose.Schema;

var class_schema = new schema({
    _id:{type:Number, require:true, unique:true},
    class_name:{type:String, require:true}
}, {collection:'company_classes'})

module.exports = mongoose.model('CompanyClass', class_schema); 