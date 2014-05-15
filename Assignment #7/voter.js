var  mongoose = require("mongoose"), mongoUrl;

if (process.env.VCAP_SERVICES) {
           services = JSON.parse(process.env.VCAP_SERVICES);
           console.log( JSON.stringify( services ));
           mongoUrl = services["mongolab"][0].credentials.uri;
} else {
	mongoUrl = "mongodb://localhost/votes";
}

mongoose.connect(mongoUrl);
var db = mongoose.connection;

db.once('open', function(){console.log("Database Opened")});

var vote_schema = mongoose.Schema({name: String, votes: Number, finalist: Boolean});
var user_schema =  mongoose.Schema({name: String, user: String});
var vote_model = mongoose.model("votes", vote_schema);
var user_model = mongoose.model("users", user_schema);


//function for incrementing vote counts, sets to 1 if input is a new name
var addVote = function (x, y, callBack) {
	user_model.find({user: y}, function(err, result) {
		if(err !== null) {
			console.log(err);
			return;
		}	

		if( result.length === 0 ) {
			var query = {name: x, user: y};
			user_model.findOneAndUpdate(query, {}, {upsert: true}, function(){console.log("Addded " + y + " to user database" )});
			vote_model.find({name: x}, function(err, result){
				if(err !== null) {
					console.log(err);
					return;
				}

				if( result.length === 0 ) {
					var query = {name: x, votes: 1, finalist: false};
					vote_model.findOneAndUpdate(query, {}, {upsert: true}, function(){console.log("Addded " + x + " to voting database" )});
					callBack({"message" : "The name " + x + " now has 1 vote.", "name" : x, "vote" : 1, "finalist" : false});
					return;
				}

				else {
					var query = {name: x};
					vote_model.findOne(query, function (err, res) {
						var newVotes = res.votes + 1;
						if(newVotes >= 5) {
							vote_model.findOneAndUpdate(query, {votes: newVotes, finalist: true}, {upsert: true}, function(){console.log("Incremented " + x + "'s votes")});
							callBack({"message" : "The name "+ x + " now has " + newVotes + " votes.", "name" : x, "vote" : res.votes, "finalist" : true});
						}

						else {
							vote_model.findOneAndUpdate(query, {votes: newVotes}, {upsert: true}, function(){console.log("Incremented " + x + "'s votes")});
							callBack({"message" : "The name "+ x + " now has " + newVotes + " votes.", "name" : x, "vote" : res.votes, "finalist" : false});
						}
						return;
					});
					return;
				}
			});
			return;
		}	

		else {
			callBack({"message" : "The username " + y + " has already submitted a vote. Please use a valid username."})
			return;
		}

	});



}

var getLengths = function (x, callBack) {
	//{votes: {$gt: 0, $lt: x}};
	vote_model.find({votes: {$lte: x}}, function(err, result){
		if(err !== null) {
			console.log(err);
			return;
		}

		if(result.length === 0) {
			callBack({"message" : "There are no names with less than or equal to " + x + " votes"})
		}

		else {
			var mes = {"message" : "Names with less than or equal to " + x + " votes are "};
			result.forEach(function (val) {
				mes.message = mes.message + val.name + " (" + val.votes + " votes), ";
			});

			mes.message = mes.message.substring(0, mes.message.length - 2);
			callBack(mes);
		}
	})
}


var getFinalists = function (callBack) {
	vote_model.find({finalist: true}, function(err, result){
		if(err !== null) {
			console.log(err);
			return;
		}

		if(result.length === 0) {
			callBack({"message" : "There are no finalists currently"})
		}

		else {
			var mes = {"message" : "Finalists are "};
			result.forEach(function (val) {
				mes.message = mes.message + val.name + " (" + val.votes + " votes), ";
			});
			mes.message = mes.message.substring(0, mes.message.length - 2);

			callBack(mes);
		}
	})
}




module.exports = {
  "addVote": addVote,
  "getLengths": getLengths,
  "getFinalists" : getFinalists
};