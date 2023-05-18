
function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(255, 0, 0);
}


function keyPressed() {
	if (key == 's') {
		saveCanvas(canvas, "Day_061.jpg");
	}
}