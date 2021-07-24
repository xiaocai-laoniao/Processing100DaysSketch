let colors = "26547c-ef476f-ffd166-06d6a0-fffcf9".split("-").map(c => "#" + c);
let units;
let angle = 0;
function setup() {
  createCanvas(1000, 800);
  units = [];

  configUnits();
}

function configUnits() {
  for (let i = 0; i < width / 10; i++) {
    for (let j = 0; j < height / 10; j++) {
      units.push({
        loc: createVector(100 * i, 100 * j),
        tScale: random(-2, 2),
        color: random(colors)
      });
    }
  }
}

function draw() {
  background(200);

  units.forEach(unit => drawUnit(unit.loc, unit.tScale, unit.color));
}

function drawUnit(loc, tScale, c) {
  let t = sin((millis() % 1000) / 80) * tScale;
  push();
  translate(loc.x - 30, loc.y - 52);
  console.log(loc.x);
  noFill();
  fill(c);
  rotate(angle);

  curveTightness(t);
  beginShape();
  curveVertex(10, 26);
  curveVertex(10, 26);
  curveVertex(83, 26);
  curveVertex(83, 65);
  curveVertex(10, 65);
  curveVertex(10, 65);
  endShape();

  pop();

  angle += 0.00001;
}

function keyPressed() {
  if (keyCode == 83) { // s save image
    save("Day_016.png");
  }
}