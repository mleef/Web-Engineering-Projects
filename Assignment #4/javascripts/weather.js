//main function that includes listeners for both the submit button press and the enter key
var main = function () {


    function getDirection(num) { 
    val= Math.round( ((num) / 22.5) + .5 ) ;
    arr=["N","NNE","NE","ENE","E","ESE", "SE", 
          "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"] ;
    return arr[ val % 16 ] ;
    }

    $("button.submit").on("click", function (event) {
        //get input, remove spaces
        var location = $(".selector").val().replace(/\s/g, '');
        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + location +"&callback=?";
        var city = 0;
        var temp = 0;
        var humidity = 0;
        var windSpeed = 0;
        var windDir = 0;
        var clouds = 0;
        $.getJSON(url, function (weatherResponse) {
            temp = Math.round(weatherResponse.main.temp - 273.15);
            humidity = weatherResponse.main.humidity;
            windSpeed = weatherResponse.wind.speed;
            windDir = weatherResponse.wind.deg;
            clouds = weatherResponse.clouds.all;
            city = weatherResponse.name;

            $(".out1").val(temp + " degrees celsius");
            $(".out2").val(humidity + " %");
            $(".out3").val(windSpeed + " metres per second blowing " + getDirection(windDir));
            $(".out4").val(clouds + " %");
            $(".out5").val(city);
            $(".selector").val("");
    });


 
    })

    $(".selector").on("keypress", function (event) {
        if(event.keyCode == 13) {
        //get input, remove spaces
        var location = $(".selector").val().replace(/\s/g, '');
        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + location +"&callback=?";
        var city = 0;
        var temp = 0;
        var humidity = 0;
        var windSpeed = 0;
        var windDir = 0;
        var clouds = 0;

        $.getJSON(url, function (weatherResponse) {
            temp = Math.round(weatherResponse.main.temp - 273.15);
            humidity = weatherResponse.main.humidity;
            windSpeed = weatherResponse.wind.speed;
            windDir = weatherResponse.wind.deg;
            clouds = weatherResponse.clouds.all;
            city = weatherResponse.name;

            $(".out1").val(temp + " degrees celsius");
            $(".out2").val(humidity + " %");
            $(".out3").val(windSpeed + " metres per second blowing " + getDirection(windDir));
            $(".out4").val(clouds + " %");
            $(".out5").val(city);
            $(".selector").val("");
    });
            
            
    }})
}


$(document).ready(main);