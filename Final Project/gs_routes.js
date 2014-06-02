
var //express = require("express"),
    //http = require("http"),
    //connect = require("connect"),
    gs = require("./gs.js")
;

//handlers for main app page (gs.html)

function retrieveProfileHandler(req, res){
    console.log("the cookie: " + JSON.stringify( req.cookies ));
    var user = req.cookies.user;
    gs.getProfile( user, function ( janswer ){res.json( janswer );} );
}

function saveProfileHandler(req, res){
    console.log("the cookie: " + JSON.stringify( req.cookies ));
    var the_body = req.body;
    the_body.user = req.cookies.user;  //add in the user name
    gs.saveProfile( the_body, function ( janswer ){res.json( janswer );} );
}

function reloadgsHandler( req, res ){
    console.log( "reload of gs with cookie: " + JSON.stringify( req.cookies ));
    //if( req.cookies.user )
        //res.json({""})
}

function matchHandler( req, res) {
  console.log("matching..." );
  var the_body = req.body;
  the_body.user = req.cookies.user;  //add in the user name
  gs.matchProfile( the_body, function ( janswer ){res.json( janswer );} );

}

module.exports = {
           "retrieveProfileHandler": retrieveProfileHandler,
           "saveProfileHandler": saveProfileHandler,
           "matchProfileHandler": matchHandler,
           "reloadgs": reloadgsHandler
};
