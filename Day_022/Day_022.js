function setup() {
	createCanvas(600, 600);
}

function draw() {
	background(255)

  // drawShadow();
  drawClip();
}

function drawShadow() {
	drawingContext.shadowBlur = 100
	drawingContext.shadowColor = color(0)
  drawingContext.shadowOffsetX = 50
	drawingContext.shadowOffsetY = 50
	ellipse(mouseX, mouseY, 200, 200);
}

function drawClip() {
  noStroke();
  fill(0);
  rect(width/2, height/2, 100, 100, 30, 20, 10, 5);
  drawingContext.clip();
  fill(255, 0, 0);
  circle(width/2, height/2, 300);
}

function keyPressed() {
  if (keyCode == 83) { // s save image
    save("Day_022.png");
  }
}