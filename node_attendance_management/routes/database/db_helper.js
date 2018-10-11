
var mongoose = require('mongoose');
var mongodb = require('mongodb');


var db_server = 'localhost';
var db_name = 'db_attendance_management';

var mongoose_attendance_management = 'mongodb://localhost/db_attendance_management';
var is_connected_db = false;

//mongoose connect db
mongoose.connect(mongoose_attendance_management);

//mongodb connect db
var mongodb_server = new mongodb.Server(db_server, 27017);
var mongodb_db = new mongodb.Db(db_name, mongodb_server); 

// mongodb_db.open(function(err, db){

// });


// var mongo_sync_server = mongo_sync.Server(db_server);
// mongo_sync_server.connect(db_attendance_management);

mongoose.connection.on('connected', function(){
  console.log('DB Connected');
  is_connected_db = true;
});

mongoose.connection.on( 'error', function(err){
  console.log( 'Failed to connect a mongo db : ' + err );
});

// mongoose.disconnect() を実行すると、disconnected => close の順番でコールされる
mongoose.connection.on( 'disconnected', function(){
  console.log( 'DB Disconnected.' );
  is_connected_db = false;
});

mongoose.connection.on( 'close', function(){
  console.log( 'DB Connection closed.' );
});


exports.is_connected_db = is_connected_db;
exports.collection = function(collection){
  return mongodb_db.collection(collection);
}