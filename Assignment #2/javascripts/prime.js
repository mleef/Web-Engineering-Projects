//global variable to store potential divisor so it can be outputted later
var divisor = 0;
 
//function that performs the prime check
var isPrime = function (num) {

    var prime = true;
    if(num < 2 || num != Math.round(num)) {
        return false
    }
    for (var i = 2; i <= Math.sqrt(num); i++) {
        if (num % i == 0) {prime = false; divisor = i;}
    }
    return prime;
}

//main function that includes listeners for both the submit button press and the enter key
var main = function () {

    $("button.submit").on("click", function (event) {
        var selector = $(".selector").val();
        if(isPrime(selector)) {
            var str = "Looks like ".concat(selector).concat(" is prime.");
            $(".out").val(str);
        }
        else {
            var str = "Looks like ".concat(divisor).concat(" divides ").concat(selector);
            $(".out").val(str);
        }
        $(".selector").val("");
    })

    $(".selector").on("keypress", function (event) {
        if(event.keyCode == 13) {
            var selector = $(".selector").val();
            if(isPrime(selector)) {
                var str = "Looks like ".concat(selector).concat(" is prime.");
                $(".out").val(str);
            }
            else {
                var str = "Looks like ".concat(divisor).concat(" divides ").concat(selector);
                $(".out").val(str);
            }
            $(".selector").val("");
        }    
    })
}


$(document).ready(main);