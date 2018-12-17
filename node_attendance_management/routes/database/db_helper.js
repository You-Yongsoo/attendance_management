
var mongoose = require('mongoose');
var mongodb = require('mongodb');

var db_server = 'localhost';
var db_name = 'db_attendance_management';

var mongoose_attendance_management_url = 'mongodb://localhost/db_attendance_management';

var mongodb_url = 'mongodb://localhost:27017';
var mongodb_dbname = 'db_attendance_management';
var mongodb;

//mongoose connect db
mongoose.connect(mongoose_attendance_management_url);

//mongodb connect db
//var mongodb_server = new mongodb.Server(db_server, 27017);
//var mongodb_db = new mongodb.Db(db_name, mongodb_server); 
var MongoClient = mongodb.MongoClient;

// var mongo_sync_server = mongo_sync.Server(db_server);
// mongo_sync_server.connect(db_attendance_management);

mongoose.connection.on('connected', function(){
  console.log('mongoose:DB Connected');
  is_connected_db = true;
});

mongoose.connection.on( 'error', function(err){
  console.log( 'mongoose:Failed to connect a mongo db : ' + err );
});

// mongoose.disconnect() を実行すると、disconnected => close の順番でコールされる
mongoose.connection.on( 'disconnected', function(){
  console.log( 'mongoose:DB Disconnected.' );
  is_connected_db = false;
});

mongoose.connection.on( 'close', function(){
  console.log( 'mongoose:DB Connection closed.' );
});

// mongodb_db.open(function(err, db){
//   if(!err){
//     console.log('mongodb:DB Connected');
//   }else{
//     console.log('mongodb:DB Connection Failed:'+err);
//   }
// });

MongoClient.connect(mongodb_url, function(err, client){
  if(!err){
    console.log('mongodb:DB Connected');
    mongodb = client.db(mongodb_dbname);
  }else{
    console.log('mongodb:DB Connection Failed:'+err);
  }
});

exports.collection = function(collection){
  return mongodb.collection(collection);
}