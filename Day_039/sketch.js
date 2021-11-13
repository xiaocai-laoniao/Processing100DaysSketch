
function setup() {
	canvas = createCanvas(640, 480);
}

function draw() {

}

function keyPressed() {
	if (key == 's') {
		saveCanvas(canvas, "Day_039.jpg");
	}
}