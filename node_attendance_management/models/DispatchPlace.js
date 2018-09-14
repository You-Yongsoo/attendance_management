var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dispatch_schema = new schema({
    id:{type:String, require:true, unique:true},
    class_name:{type:String, require:true}
}, {collection:'dispatch_places'})

module.exports = mongoose.model('DispatchPlace', dispatch_schema); 