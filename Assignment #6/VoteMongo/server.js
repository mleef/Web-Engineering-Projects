
var express = require("express"), http = require("http"), v = require("./voter.js"), connect = require("connect"),
app;

// Create our Express-powered HTTP server // and have it listen on port 3000
app = express(); http.createServer(app).listen(3000);

// set up a static file directory to use for default routing
// also see the note below about Windows
app.use(express.static(__dirname + "/client"));
app.use(connect.urlencoded());

// set up our routes
app.post("/voter", 
	function (req, res) { 
		var my_object = req.body;	//{target: 111}
		var the_response = v.addVote(my_object.target, function (answer) {
			res.json(answer);
		});
});

app.post("/length", 
	function (req, res) { 
		var my_object = req.body;	//{target: 111}
		var the_response = v.getLengths(my_object.target, function (answer) {
			res.json(answer);
		});
});

app.post("/finalists", 
	function (req, res) { 
		var my_object = req.body;	//{target: 111}
		var the_response = v.getFinalists(function (answer) {
			res.json(answer);
		});
});