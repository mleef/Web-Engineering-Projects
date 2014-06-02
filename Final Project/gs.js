
var mongoose = require("mongoose"),
    mongoUrl;

    // set up our services
if (process.env.VCAP_SERVICES) {
           services = JSON.parse(process.env.VCAP_SERVICES);
           console.log( "food services: " + JSON.stringify( services ));
           mongoUrl = services["mongolab"][0].credentials.uri;
           console.log( "grad school url: " + mongoUrl);
} else {
           //use this when not running on Cloud Foundry
           mongoUrl = "mongodb://localhost/login2";
}

//test out moongoose
mongoose.createConnection(mongoUrl);  //need createConnection because have two - see login.js

var db = mongoose.connection;

db.once('open', function () {
  console.log( "moongoose gs open!")});
db.on('error', console.error.bind(console, 'gs connection error:'));
db.once('connecting', function () {
  console.log( "moongoose gs connecting!")});
db.once('connected', function () {
  console.log( "moongoose gs connection!")});
db.on('disconnecting', function () {
  console.log( "moongoose gs disconnecting!")});
process.on('SIGINT', function() {
     db.close(function () {
       console.log('Mongoose gs disconnected through app termination');
       process.exit(0);
  });
});

var profile_schema = mongoose.Schema({ name : {type: String, unique: true}, 
          undergrad : {school : String, major : String, minor : String, GPA : Number, extra : String},
          GRE : {verbal : Number, quantitative : Number, writing : Number}, 
          experience : String,
          schools : [{school : String, program : String, subject: String, accepted : Boolean}],
          user: String
        });

var profile_model = mongoose.model("profile", profile_schema); //profile => collection profiles

//put something in db to define it.
var query = { name : "Steven", 
          undergrad : {school : "Oregon State University", major : "Computer Science", minor : "Biology", GPA : 3.8, extra : ["Club tennis", "School plays"]},
          GRE : {verbal : 155, quantitative : 150, writing : 6}, 
          experience : "Strong reserach background",
          schools : [{school : "University of Washington", program : "Computer Science", accepted : true}]
        }
profile_model.findOneAndUpdate( query, {}, {upsert: true}, function( err, doc){
                                  console.log("profile test query: " + err + " & " + doc);}
                                  );

function mongoGet( name, callBack ){
          console.log( "mongoGet: " + name );
          profile_model.find({"user": name},
                   function (err, result) {
                      console.log( "result of find: " + result);
                      if (err !== null) {
                         console.log("ERROR: " + err);
                         callBack({"name": null});
                         return;
                   }
                   if( result.length > 0 ) callBack({ "name" : result[0].name, 
                      "undergrad" : result[0].undergrad,
                      "GRE" : result[0].GRE, 
                      "experience" : result[0].experience,
                      "schools" : result[0].schools,
                      "user" : result[0].user
                    });
                   else callBack({"name": null});
                   }
              );
}

//http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
function mongoSave( body, callBack ){
  console.log( "mongoSave: " + JSON.stringify( body ) );
  var query = {"name": body.name};
  profile_model.findOneAndUpdate( query, { "name" : body.name, 
                      "undergrad" : body.undergrad,
                      "GRE" : body.GRE, 
                      "experience" : body.experience,
                      "schools" : body.schools,
                      "user" : body.user
                    }, {upsert: true, "new": true},
                     function(err, doc){ console.log( "saved: " + JSON.stringify( doc) );
                                         callBack({"error": err, "message": doc}); });
}

function mongoMatch( body, callBack) {



}

module.exports = {
          "getProfile": mongoGet,
          "saveProfile": mongoSave,
          "matchProfile" : mongoMatch
				};