//call back functions to be set up

// // function handleLoginResult(resp_body) {
// //                       console.log( resp_body );
// //                       $("#feedback").text( JSON.stringify( resp_body) );
// //                       sessionStorage.setItem('name', resp_body.user);
// //                       if( resp_body.url ) window.location = resp_body.url; //load main app page
// //                   };

// // function handleRegisterResult(resp_body) {
// //               console.log( resp_body );
// //               $("#feedback").text( JSON.stringify( resp_body) )
// //               if( resp_body.url ) window.location = resp_body.url;
// // };

// function handleRetrieveResult(resp_body) {
//                               console.log( resp_body );
//                               var food = resp_body.food;
//                               $("#food").val( food );
//                           };

// function handleSaveResult(resp_body) {
//   console.log( resp_body );
//    var food = resp_body.food;
//    $("#feedback").text( JSON.stringify( resp_body) );
// };

var main = function (){
    //more listeners to set up
   // $("button#login").on("click", function (event){ 
   //   $.get("login.json",
   //    {"name": $("#old_name").val(), "password": $("#old_pass").val() },
   //   handleLoginResult);
   //  });

   //  $("button#register").on("click", function (event){ 
   //   $.post("register.json",
   //       {"name": $("#new_name").val(), "password": $("#new_pass").val() },
   //         handleRegisterResult);
   //  });

   //  $("button#save").on("click", function (event){ 
   //                  $.post("save.json",
   //                         {"food": $("#food").val()},
   //                         handleSaveResult);
   //             });

   // $("button#retrieve").on("click", function (event){ 
   //    $.get("retrieve.json",
   //    {},
   //     handleRetrieveResult);
   //  });
    $("button#save").on("click", function (event){ 
        //get data together
        var school = $("input#school").val();
        var major = $("input#major").val();
        var minor = $("input#minor").val();
        var gpa = $("input#gpa").val();
        var extra = ($("input#extra").val()).split(' ');
        var verbal = $("input#verbal").val();
        var quantitative = $("input#quantitative").val();
        var written = $("input#written").val();

        // var program = $("#program option:selected").text();
        // var subject = $("#subject option:selected").text();
        
        //var name = sessionStorage.getItem('name');
        //send it to server
        //$.post('modify_user_profile.json', {your stuff}, function(err, result){
        //if err maybe repost
        //});
        //update model
        UserModel.setAll({undergrad: {school: school, major: major, minor: minor, GPA: gpa, extra: extra}, GRE:{verbal: verbal, writing: written, quantitative: quantitative}
        });
        console.log(UserModel);
    });
}