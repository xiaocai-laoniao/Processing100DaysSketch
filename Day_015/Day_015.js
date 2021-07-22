// 公众号、视频号、Bilibili：小菜与老鸟

let unit = 100;
let space = 20;

function setup() {
  createCanvas(1000, 800);
  background(255);
  frameRate(20);
}

function draw() {
  background(255);
  fill(0, 255, 120, 120);
  // rect(0, 0, 0, 30);

  for (let i = 0; i < width / (unit + space); i++) {
    for (let j = 0; j < height / (unit + space); j++) {
      let loc = createVector(40 + (unit + space) * i, 40 + (unit + space) * j);
      let frameDelta = (i + j) * 10;
      drawUnit(loc, frameDelta);
    }
  }
}

function drawUnit(location, frameDelta) {
  push();
  let deltaY = sin(frameCount + frameDelta) * 4;
  translate(location.x, location.y + deltaY);

  beginShape();
  let delta = sin(frameCount + frameDelta) * random(4, 10);
  vertex(-40 + delta, -40 - delta);
  vertex(40 + delta, -40 + delta);
  vertex(40 - delta, 40 + delta);
  vertex(-40 - delta, 40 - delta);
  beginContour();
  vertex(-20 - delta, -20 + delta);
  vertex(-20 + delta, 20 + delta);
  vertex(20 + delta, 20 - delta);
  vertex(20 - delta, -20 + delta);
  endContour();
  endShape(CLOSE);

  pop();
}

function keyPressed() {
  if (keyCode == 83) { // s save image
    save("Day_015.png");
  }
}