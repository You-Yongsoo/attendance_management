var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var class_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    class:{type:String, require:true}
}, {collection:'company_classes'})

module.exports = mongoose.model('CompanyClass', class_schema); 