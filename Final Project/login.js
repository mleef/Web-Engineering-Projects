
var mongoose = require("mongoose"), bcrypt = require("bcrypt"),
    mongoUrl;

if (process.env.VCAP_SERVICES) {
           services = JSON.parse(process.env.VCAP_SERVICES);
           console.log( "login services: " + JSON.stringify( services ));
           login_mongoUrl = services["mongolab"][0].credentials.uri;
           console.log( "login url: " + login_mongoUrl);
} else {
           //use this when not running on Cloud Foundry
           console.log("Using localhost/login2");
           login_mongoUrl = "mongodb://localhost/login2";
}

//bcrypt.hash("my plain password", null, null, function(err,hash){});
//bcrypt.compare("my plain password", hash); //true 


mongoose.connect(login_mongoUrl);  //createConnection did not work here! Odd. Works in foods.js!
var db = mongoose.connection;

//db.on('open', openHandler);
db.once('open', function () {
  console.log( "moongoose login open!")});
db.on('error', console.error.bind(console, 'login connection error:'));
db.once('connecting', function () {
  console.log( "moongoose login connecting!")});
db.once('connected', function () {
  console.log( "moongoose login connection!")});
db.on('disconnecting', function () {
  console.log( "moongoose login disconnecting!")});
process.on('SIGINT', function() {
     db.close(function () {
       console.log('Mongoose disconnected through app termination');
       process.exit(0);
  });
});

//set up new collection: schema + model
var UserSchema = mongoose.Schema({ user: {type: String, unique : true }, //see save below
                                     password: String,
                                     history: [String],
                                     compromised: [String]});
var User = mongoose.model("User", UserSchema);

//need something in db for it to be defined
var query = {"user": "steve", "password": "evets", "history": ["steve"], "compromised": ["steve"]};  //add for testing
User.findOneAndUpdate( query, {}, {upsert: true}, function(err, doc){
                                                    console.log( "test err: " + err);
                                                    console.log( "test doc: " + doc);
});

//this tests out the "unique" key on user - should give error message second time run"
var user1 = new User( {"user": "simon", "password": "a", "history": [], "compromised": []} );
user1.save( function(err, doc ){
      if (err) {
        console.log("save error: " + JSON.stringify( err ));
      } else {
        console.log("doc saved: " + JSON.stringify( doc ));
      }
    });

//gives you messages on various db events
db.once('open', function () {
  console.log( "moongoose login open!")});
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connecting', function () {
  console.log( "moongoose login connecting!")});
db.on('connected', function () {
  console.log( "moongoose login connection!")});
db.on('disconnecting', function () {
  console.log( "moongoose login disconnecting!")});

//expects login to be of form {name: String, password: String}
//provides callBack with arg: {"name": bool, "password": bool} or {err: error}
function mongoCheckExistence( login, callBack ){
    console.log( "checking existence: " + JSON.stringify( login ) );
    var name = login.name;          //assume unique
    var pass = login.password;      //not unique
    User.findOne({"user": name},
             function (err, result) {
                console.log( "existence result: " + JSON.stringify( result ));
                if (err !== null) {
                   console.log("ERROR: " + err);
                   callBack({"err": err});
                   return;
                }
                if( result ){
                    //compare stored hash to hash of inputted password
                   if( bcrypt.compareSync(pass, result.password))
                      callBack({"name": true, "password": true});  //both matched
                    else
                      callBack({"name": true, "password": false}); //only name matched
                } else {
                  //could optionally check for password match here - useful info?
                  callBack({"name": false, "password": null});     //name did not match
                }
             });
}

//expects login to be of form {name: String, password: String}
//provides callBack with arg: {"saved": bool} or {err: error}
function mongoRegister( login, callBack ){
          mongoCheckExistence( login, function( result ){
                      if( result.err ){
                           callBack({"err": result.err});  //just pass it back to callee
                           return;
                      }
                      if( result.name ){
                           callBack({"saved": false});  //exists so was not saved
                      } else {
                           //Big thing to note - we are not waiting for save result before calling back to client
                           var pass = login.password;
                           //hash the password and store the hash
                           var hash = bcrypt.hashSync(pass, 10);
                           var user = new User( {"user": login.name, password: hash,
                                                  "history": [], "compromised": [] });
                           user.save(function (err, doc){ 
                             console.log( "register result: " + JSON.stringify( err ) + " & " + JSON.stringify( doc));
                           });
                           callBack({"saved": true});
                      }
                   });
}

//expects login to be of form {name: String, password: String}
//provides callBack with arg: {"name": bool, "password": bool} or {err: error}
function mongoLogin( login, callBack ){
          mongoCheckExistence( login, function( result ){
                      if( result.err )
                           callBack({"err": result.err});  //just pass it back to callee
                      else
                           callBack(result);  //let callee know how it matched
                   });
}

module.exports = {
          "handleRegistration": mongoRegister,
          "handleLogin": mongoLogin,
          "checkExistence": mongoCheckExistence
				};