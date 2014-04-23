//global list for keeping track of votes
var voteList = new Array();

//function for incrementing vote counts, sets to 1 if input is a new name
var addVote = function (name) {
	if(!voteList[name]) {
		voteList[name] = 1;
	}
	else {
		voteList[name] = voteList[name] + 1;
	}

	return voteList[name];
}


//main function that includes listeners for both the submit button press and the enter key
var main = function () {

    $("button.submit").on("click", function (event) {
        var selector = $(".selector").val();
       	var votes = addVote(selector);
       	var str = "";
       	if(votes == 1) {
       		str = "The name ".concat(selector).concat(" now has ").concat(votes).concat(" vote.")
        }
        else {
        	str = "The name ".concat(selector).concat(" now has ").concat(votes).concat(" votes.")
        }

        $(".out").val(str);
        $(".selector").val("");

	})

	$(".selector").on("keypress", function (event) {
		if(event.keyCode == 13) {
        var selector = $(".selector").val();
       	var votes = addVote(selector);
       	var str = "";
       	if(votes == 1) {
       		str = "The name ".concat(selector).concat(" now has ").concat(votes).concat(" vote.")
        }
        else {
        	str = "The name ".concat(selector).concat(" now has ").concat(votes).concat(" votes.")
        }

        $(".out").val(str);
        $(".selector").val("");
		}
	})
}


$(document).ready(main);