var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dispatch_schema = new Schema({
    id:{type:Schema.Types.ObjectId, require:true, unique:true},
    dispatch_place:{type:String, require:true},
    start_time:{type:String, require:true},
    end_time:{type:String, require:true}
}, {collection:'dispatch_places'})

module.exports = mongoose.model('DispatchPlace', dispatch_schema); 