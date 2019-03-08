var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var beaconInfo_schema = new Schema({
    macaddress:{type:Number, require:true, unique:true},
    uuid:{type:String, require:true},
    major:{type:Number, require:true},
    minor:{type:Number, require:true},
    rssi:{type:Number, require:true},
    battery:{type:Number, require:true}
}, {collection:'detectivelog'});

module.exports = mongoose.model('BeaconInfo', beaconInfo_schema); 