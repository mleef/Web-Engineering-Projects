var  mongoose = require("mongoose");


mongoose.connect('mongodb://localhost/votes');
var db = mongoose.connection;

db.once('open', function(){console.log("Database Opened")});

var simple_schema = mongoose.Schema({name: String, votes: Number, finalist: Boolean});
var simple_model = mongoose.model("votes", simple_schema);


//function for incrementing vote counts, sets to 1 if input is a new name
var addVote = function (x, callBack) {
    simple_model.find({name: x}, function(err, result){
		if(err !== null) {
			console.log(err);
			return;
		}

		if( result.length === 0 ) {
			var query = {name: x, votes: 1, finalist: false};
			simple_model.findOneAndUpdate(query, {}, {upsert: true}, function(){console.log("Addded " + x + " to database" )});
			callBack({"message" : "The name " + x + " now has 1 vote.", "name" : x, "vote" : 1, "finalist" : false});
			return;
		}

		else {
			var query = {name: x};
			simple_model.findOne(query, function (err, res) {
				var newVotes = res.votes + 1;
				if(newVotes >= 5) {
					simple_model.findOneAndUpdate(query, {votes: newVotes, finalist: true}, {upsert: true}, function(){console.log("Incremented " + x + "'s votes")});
					callBack({"message" : "The name "+ x + " now has " + newVotes + " votes.", "name" : x, "vote" : res.votes, "finalist" : true});
				}

				else {
					simple_model.findOneAndUpdate(query, {votes: newVotes}, {upsert: true}, function(){console.log("Incremented " + x + "'s votes")});
					callBack({"message" : "The name "+ x + " now has " + newVotes + " votes.", "name" : x, "vote" : res.votes, "finalist" : false});
				}
				return;
			});
			return;
		}
	});

}

var getLengths = function (x, callBack) {
	//{votes: {$gt: 0, $lt: x}};
	simple_model.find({votes: {$lte: x}}, function(err, result){
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
	simple_model.find({finalist: true}, function(err, result){
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