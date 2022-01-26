// let colors = "07ed94-390099-9e0059-ff0054-ff5400-ffbd00-473BF0-f37748-d56062-fff-0c0a3e-7b1e7a-b33f62-f3c677".split("-").map(a=>`#${a}`);
let colors = "d7cf07-d98324-e4572e-17bebb-ffc914-2e282a-76b041-a30000-efd28d"
  .split("-")
  .map((a) => `#${a}`);
let tigers = [];
let overAllTexture;
let capturer;
let isCapturing;

function setup() {
  createCanvas(750, 1250); // 封面故事
  // createCanvas(957, 1278); // 封面
  background(100);
  strokeCap(ROUND);
	setupCapture();

  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();
  for (var i = 0; i < width + 50; i++) {
    for (var o = 0; o < height + 50; o++) {
      overAllTexture.set(
        i,
        o,
        color(100, noise(i / 3, o / 3, (i * o) / 50) * random([0, 50, 100]))
      );
    }
  }
  overAllTexture.updatePixels();

  for (var x = 80; x < width; x += 120) {
    for (var y = 80; y < height; y += 120) {
      addTiger(x, y);
    }
  }
}

function draw() {
  fill(197, 69, 63);
  rect(0, 0, width, height);
  tigers.forEach((tiger) => {
    tiger.update();
    tiger.draw();
  });

  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0);
  pop();

	if (capturer && isCapturing) {
		capturer.capture(document.getElementById("defaultCanvas0"));
	}
}

function addTiger(x, y) {
  tigers.push(
    new Tiger({
      p: createVector(x, y),
    })
  );
}

function keyPressed() {
  if (key == "s") {
    save("Day_056.jpg");
  } else if (key == 'c') {
		console.log("capture start...");
		capturer.start();
		isCapturing = true;
	} else if (key == 'n') {
		console.log("capture end...");
		capturer.stop();
		capturer.save();
		isCapturing = false;
	}
}

function setupCapture() {
  capturer = new CCapture({
    format: "webm",
    framerate: 24
	})
}

class Tiger {
  constructor(args) {
    let def = {
      p: createVector(width / 2, height / 2),
      v: createVector(0, 0),
      a: createVector(0, 0),
      randomId: random(500),
      faceWidth: random(60, 100),
      faceHeight: random(60, 100),

      earRadius: random(10, 20),
      earColor: random(colors),
      earForgroundRadius: random(8, 10),
      earForgroundColor: random(colors),

      mouseWidth: random(10, 20),
			mouseStrokeWeight: random(2, 3),

      eyeRadius: random(8, 14),
      eyeBallRadius: random(4, 6),
      eyeXOffset: random(14, 20),
      eyeYOffset: random(30, 40),

			beardStrokeWeight: random(1, 3),

      colors: [
        random(colors),
        random(colors),
        random(colors),
        random(colors),
        random(colors),
        random(colors),
        random(colors),
      ],
      faceColor: random(colors),
      ang: random(-0.1, 0.1),
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  drawFace() {
    fill(this.faceColor);
    rect(0, 0, this.faceWidth, this.faceHeight, 40, 40, 10, 10);
  }

  drawLeftEar() {
    noStroke();
    fill(this.earColor);
    circle(
      0 - this.faceWidth / 2,
      0 - this.faceHeight / 2 + 5,
      this.earRadius * 2
    );
    fill(this.earForgroundColor);
    circle(
      0 - this.faceWidth / 2,
      0 - this.faceHeight / 2 + 5,
      this.earForgroundRadius * 2
    );
  }

  drawRightEar() {
    noStroke();
    fill(this.earColor);
    circle(
      0 + this.faceWidth / 2,
      0 - this.faceHeight / 2 + 5,
      this.earRadius * 2
    );
    fill(this.earForgroundColor);
    circle(
      0 + this.faceWidth / 2,
      0 - this.faceHeight / 2 + 5,
      this.earForgroundRadius * 2
    );
  }

  drawLeftEye() {
    fill(255);
    circle(
      0 - this.eyeXOffset,
      0 - this.faceHeight / 2 + this.eyeYOffset,
      this.eyeRadius * 2
    );
    fill(0);
    circle(
      0 - this.eyeXOffset,
      0 - this.faceHeight / 2 + this.eyeYOffset,
      this.eyeBallRadius * 2
    );
  }

  drawRightEye() {
    fill(255);
    circle(
      0 + this.eyeXOffset,
      0 - this.faceHeight / 2 + this.eyeYOffset,
      this.eyeRadius * 2
    );
    fill(0);
    circle(
      0 + this.eyeXOffset,
      0 - this.faceHeight / 2 + this.eyeYOffset,
      this.eyeBallRadius * 2
    );
  }

  drawKingMark() {
		stroke(0);
		stroke(2);
		fill(0);
    ellipse(0, 0 - this.faceHeight / 2 + 17, 5, 30);
    ellipse(0, 0 - this.faceHeight / 2 + 10, 20, 5);
    ellipse(0, 0 - this.faceHeight / 2 + 20, 20, 5);
  }

  drawNose() {
    fill(0);
    beginShape();
    vertex(0 - 10, 0);
    vertex(0 + 10, 0);
    vertex(0, 0 + 10);
    endShape(CLOSE);
  }

  drawMouse() {
    stroke(0);
    strokeWeight(this.mouseStrokeWeight);
    noFill();
    let startPos = createVector(0, 0 + 10);
    let endPos = createVector(0, 0 + 10 + 4);
    line(startPos.x, startPos.y, endPos.x, endPos.y);

    let scale = map(abs(sin(this.randomId + frameCount / 20)), 0, 1, 0.2, 1);
    let dynamicMouseWidth = this.mouseWidth * scale;
    arc(
      endPos.x - dynamicMouseWidth / 2,
      endPos.y,
      dynamicMouseWidth,
      this.mouseWidth,
      0,
      -PI
    );
    arc(
      endPos.x + dynamicMouseWidth / 2,
      endPos.y,
      dynamicMouseWidth,
      this.mouseWidth,
      0,
      PI
    );
  }

  drawLeftBeard() {
    stroke(0);
    strokeWeight(this.beardStrokeWeight);
    let startPos = createVector(0 - 30, 0 + 10);
    line(startPos.x, startPos.y, startPos.x - 30, startPos.y);
    line(startPos.x, startPos.y + 10, startPos.x - 30, startPos.y + 10);
  }

  drawRightBeard() {
    stroke(0);
    strokeWeight(this.beardStrokeWeight);
    let startPos = createVector(0 + 30, 0 + 10);
    line(startPos.x, startPos.y, startPos.x + 30, startPos.y);
    line(startPos.x, startPos.y + 10, startPos.x + 30, startPos.y + 10);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(
      this.ang + sin(this.randomId + frameCount / 10 + this.p.x + this.p.y) / 4
    );

    rectMode(CENTER);
    ellipseMode(CENTER);

    this.drawLeftEar();
    this.drawRightEar();
    this.drawFace();
    this.drawLeftBeard();
    this.drawRightBeard();
    this.drawNose();
    this.drawMouse();
    this.drawKingMark();
    this.drawLeftEye();
    this.drawRightEye();
    pop();
  }

  update() {}
}
