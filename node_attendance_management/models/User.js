var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user_schema = new schema({
    username:{type:String, require:true, unique:true},
    password:{type:String, require:true}
}, {collection:'users'})

module.exports = mongoose.model('User', user_schema); 