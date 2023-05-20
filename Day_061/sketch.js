let radius = 100;
function setup() {
	canvas = createCanvas(680, 1600);
	background(255);
	textAlign(CENTER, CENTER);

	let x = 120;
	let y = 140;
	let spacingX = 220;
	let spacingY = 250;

	noiseSeed(1000);

	drawPoints(x, y, radius, function() {
		return random(1);
	}, "random(1)");

	drawPoints(x + spacingX, y, radius, function() {
		return 1 - random(random(1));
	}, "1 - random(random(1))");

	drawPoints(x + 2 * spacingX, y, radius, function() {
		return 1 - random(random(random(1)));
	}, "1 - random(random(random(1)))");

	drawPoints(x, y + spacingY, radius, function() {
		return 1 - random(random(random(random(1))));
	}, "1 - random(random(random(random(1))))");

	drawPoints(x + spacingX, y + spacingY, radius, function() {
		return 1 - sqrt(random(1));
	}, "1 - sqrt(random(1))");

	drawPoints(x + 2 * spacingX, y + spacingY, radius, function() {
		return sqrt(random(1));
	}, "sqrt(random(1))");

	drawPoints(x, y + 2 * spacingY, radius, function() {
		return pow(1 - pow(random(1), 10) ,10);
	}, "pow(1 - pow(random(1), 10) ,10)");

	drawPoints(x + spacingX, y + 2 * spacingY, radius, function() {
		return tan(random(TWO_PI));
	}, "tan(random(TWO_PI))");

	drawPoints(x + 2 * spacingX, y + 2 * spacingY, radius, function() {
		return atan(random(TWO_PI)) / sqrt(2);
	}, "atan(random(TWO_PI)) / sqrt(2)");

	drawPoints(x, y + 3 * spacingY, radius, function() {
		return pow(random(1), 10);
	}, "pow(random(1), 10)");

	drawPoints(x + spacingX, y + 3 * spacingY, radius, function(angle) {
		return sin(random(angle));
	}, "sin(random(angle))");

	drawPoints(x + 2 * spacingX, y + 3 * spacingY, radius, function(angle) {
		return cos(random(angle));
	}, "cos(random(angle))");

	drawPoints(x, y + 4 * spacingY, radius, function(angle) {
		return noise(angle);
	}, "noise(angle)");

	drawPoints(x + spacingX, y + 4 * spacingY, radius, function(angle) {
		return exp(random(1));
	}, "exp(random(1))");

	drawPoints(x + 2 * spacingX, y + 4 * spacingY, radius, function(angle) {
		return exp(random(1)) / 2;
	}, "exp(random(1)) / 2");

	drawPoints(x, y + 5 * spacingY, radius, function(angle) {
		return pow(noise(angle), random(1))
	}, "exp(random(1)) / 2");

	drawPoints(x + spacingX, y + 5 * spacingY, radius, function(angle) {
		return exp(noise(angle)) / random(3);
	}, "exp(noise(angle)) / random(3)");

	drawPoints(x + 2 * spacingX, y + 5 * spacingY, radius, function(angle) {
		return 1 - exp(noise(angle)) / random(3);
	}, "1 - exp(noise(angle)) / random(3)");


	fill(255, 0, 0);
	textSize(20);
	text("小菜与老鸟", width / 2, 20);
}


// random(1) * radius
function drawPoints(centerX, centerY, radius, rndFunc, description) {
	push();
	stroke(0);
	translate(centerX, centerY);
	let count = 10000;
	for (let i = 0; i < count; i++) {
		let angle = random(TWO_PI);
		let r = rndFunc(angle);
		let x = cos(angle) * r * radius;
		let y = sin(angle) * r * radius;
		point(x, y);
	}
	rectMode(CENTER);
	noFill();
	rect(0, 0, 2 * radius, 2 * radius);
	textAlign(CENTER);
	textSize(12);
	stroke(255, 0, 0);
	text(description, 0, radius + 20);
	pop();
}


function keyPressed() {
	if (key == 's') {
		saveCanvas(canvas, "Day_061.jpg");
	}
}