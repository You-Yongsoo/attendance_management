var mongoose = require('mongoose');
var schema = mongoose.Schema;

var dispatch_schema = new schema({
    _id:{type:Number, require:true, unique:true},
    dispatch_place:{type:String, require:true}
}, {collection:'dispatch_places'})

module.exports = mongoose.model('DispatchPlace', dispatch_schema); 