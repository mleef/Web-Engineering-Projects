
var 
    login = require("./login.js")
;

var cookie_options = {};

//handlers for login page

//expect body to be {name: String, password: String}
//provides callBack with either {url: url} or {name: Bool, password: Bool}
function loginHandler(req, res){
    var the_body = req.query;
    console.log ( "login request: " + JSON.stringify(the_body) );
    login.handleLogin( the_body, function ( janswer ){
                        console.log( "login resonse: " + JSON.stringify( janswer));
                        if( janswer.name !== true || janswer.password !== true )
                            res.json( janswer );
                        else {
                            res.cookie('user', the_body.name, cookie_options);
                            res.json({"url": "./gs.html"});
                        };
                    });
}

//expect body to be {name: String, password: String}
//provides callBack with either {saved: Bool} or {name: Bool, password: Bool}
function registerHandler(req, res){
  var the_body = req.body;
  console.log ( "registration request: " + JSON.stringify( the_body ));
  login.handleRegistration( the_body ,
        function ( janswer ){
            console.log( "registration result: " + JSON.stringify( janswer));
            if( janswer.saved === false )
                res.json( janswer );
            else {
                res.cookie('user', the_body.name, cookie_options);
                res.json({"url": "./gs.html"});
            };
        });
}


module.exports = {
          "loginHandler": loginHandler,
           "registerHandler": registerHandler,
};
