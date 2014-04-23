
var ctx = myCanvas.getContext("2d");


var duck = new Image();
var ball = new Image()

duck.onload = function() {

	ctx.drawImage(duck, 0, 0);

};
duck.src = "images/duck.gif";


ctx.font = "120px Arial";
ctx.fillStyle = 'green';
ctx.fillText("Go Ducks",650,250);

var colorChange = 0;


var main = function () {
	if(colorChange == 0) {
		ctx.fillStyle = 'yellow';
		ctx.fillText("Go Ducks",650,250);
		colorChange = 1;
	}

	else {
		ctx.fillStyle = 'green';
		ctx.fillText("Go Ducks",650,250);
		colorChange = 0;
	}


}




setInterval(main, 100); 