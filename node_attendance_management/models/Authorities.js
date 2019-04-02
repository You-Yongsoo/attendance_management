var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authority_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    authority:{type:String, require:true},
    authority_value:{type:String, require:true}
}, {collection:'authorities'})

module.exports = mongoose.model('Authority', authority_schema); 