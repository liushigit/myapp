var MongoClient = require('mongodb').MongoClient;

var MongoStore = function (uri) {
	
	MongoClient.connect(uri, function(err, db) {
  		if(!err) {
    		console.log("session db connected");
    		this.db = db;
		} else {

		}
	});
}