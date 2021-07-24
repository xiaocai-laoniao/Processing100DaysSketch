// study from https://openprocessing.org/sketch/922079

let font;

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
}

var colors = "fff-acadbc-9b9ece-6665dd-473bf0".split("-").map(a => "#" + a);

function preload() {
  font = loadFont('Hack Bold Nerd Font Complete Mono.ttf');
}

function setup() {
  createCanvas(1200, 800);
  background(100);
  fill(255);
  rect(0, 0, width, height);
  let word = "A";
  textAlign(CENTER);
  points = font.textToPoints(word, 0, 0, width * 0.8, {
    sampleFactor: 0.03,
    simplifyThreshold: 0
  });
  bounds = font.textBounds(word, 0, 0, 10);
  points.forEach(p => {
    p.x += width * 0.3;
    p.y += height * 0.92;
  });
  mouseX = width / 2;
  mouseY = height / 2;

}

let mt = 0;

function draw() {
  fill(255);
  noStroke();
  background(20, 200);
  strokeWeight(1);
  stroke(255, 50);
  if (mouseIsPressed) {
    mt++;
    if (mt > 60) {
      mt = 0;
    }
  } else if (mt > 0) {
    mt -= 2;
  }
  points.forEach((p, pId) => {
    let startRatio = map(frameCount * 2 - pId / 100 - noise(p.x, p.y, 20000) * 50 + 10, 0, 50, 0, 1, true);
    let mRatio = map(mt * 5 - pId / 100 - noise(p.x, p.y, 20000) * 50 + 10, 0, 50, 0, 1, true);

    push();
    let dF = createVector(p.x - mouseX, p.y - mouseY).normalize();
    dF.mult(random(0, 0.1) + noise(p.x, p.y, 200) * 2 + 0.5);
    let len = dist(p.x, p.y, mouseX, mouseY);
    dF.mult(8 / pow(len, 0.2) * (easeOutExpo(startRatio) + easeOutExpo(mRatio)));

    translate(dF.copy().mult(3));
    let stColor = color(["#D58936", "#333", "#D58936"][int((p.x + p.y) / 10) % 3]);
    let edColor = color('white');
    let st = noise(p.x, p.y, 5000) * 40;
    translate(p.x, p.y);
    for (var i = st; i > 0; i -= 1) {

      let c = lerpColor(stColor, edColor, i / st);

      c.setAlpha(noise(p.x, p.y, 50) * 100 + 155);
      if (noise(p.x, p.y, 9000) < 0.6) {
        fill(c);
        noStroke();
      } else {
        strokeWeight(0.7);
        c.setAlpha(255);
        stroke(c);
        noFill();
      }
      ellipse(0, 0, i);
      translate(dF);
      scale(noise(i / 100, frameCount / 30) * 0.1 + 0.9);
    }


    pop();
  });

  beginShape(LINES);
  noFill();
  stroke(255, 200);
  strokeWeight(2);
  points.forEach(p => {
    push();
    translate(noise(frameCount / 1000, 1000) * 5,
      noise(frameCount / 1000, 10000) * 5);
    ellipse(p.x, p.y, 3);
    pop();
  });
  endShape();
}

function keyPressed() {
  if (keyCode == 83) { // s save image
    save("Day_017.png");
  }
}