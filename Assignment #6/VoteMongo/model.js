var redis = require("redis"),
    mongoose = require("mongoose");


var client = redis.createClient();

client.set( "target", 201, redis.print);
client.get( "target", function(err, result){console.log(err); console.log(result);});


mongoose.connect('mongodb://localhost/targets');
var db = mongoose.connection;

db.once('open', function(){console.log("Database Opened")});

var simple_schema = mongoose.Schema({target: Number});
var simple_model = mongoose.model("race", simple_schema);

var query = {target: 201};
simple_model.findOneAndUpdate(query, {}, {upsert: true}, function(){console.log("Added to Mongo Database")});

var start_time, end_time;

function redisGet ( x, callBack ) {


}


function mongoGet ( x, callBack ) {
	start_time = new Date().getTime();
	simple_model.find({target: x}, function(err, result){
		end_time = new Date().getTime();
		if(err !== null) {
			console.log(err);
		}

		if( result.length === 0 ) {
			callBack({"message" : "not found", "timer" : (end_time - start_time)});
			return;
		}
		callBack({"message" : result, "timer" : (end_time - start_time)});
	});

}


module.exports = {
					"redisGet": redisGet,
          			"mongoGet": mongoGet
				};