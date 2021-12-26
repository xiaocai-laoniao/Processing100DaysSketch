import processing.sound.*;

SoundFile sample;
Amplitude rms;
PGraphics shots;

int batchShots = 10;

void setup() {
  size(800, 800);

  stroke(0);
  noFill();
  textAlign(LEFT, CENTER);

  shots = createGraphics(width, height);

  sample = new SoundFile(this, "gun.mp3");
  sample.loop();

  rms = new Amplitude(this);
  rms.input(sample);
}

void draw() {
  background(255);

  drawGunTarget();
  drawShots();
}

void drawGunTarget() {
  strokeWeight(2);
  for (int i = 0; i < 11; i++) {
    noFill();
    circle(width / 2, height / 2, 40 + 60 * i);
    if (10 - i > 0) {
      fill(0);
      text(10 - i, width / 2 - 40 - 30 * i, height / 2);
    }
  }
  line(width / 2 - 5, height / 2, width / 2 + 5, height / 2);
  line(width / 2, height / 2 - 5, width / 2, height / 2 + 5);
}

void drawShots() {
  float rmsValue = rms.analyze();
  shots.beginDraw();
  shots.noStroke();
  shots.fill(0);
  if (rmsValue > 0.5) {
    for (int i = 0; i < batchShots; i++) {
      float x = width / 2 + randomGaussian() * (40 + 60 * 10) / 2;
      float y = height / 2 + randomGaussian() * (40 + 60 * 10) / 2;
      shots.circle(x, y, rmsValue * 10);
    }
  }
  shots.endDraw();

  image(shots, 0, 0);
}

void keyPressed() {
  if (key == '1') {
    batchShots = 10;
  } else if (key == '2') {
    batchShots = 20;
  } else if (key == '3') {
    batchShots = 30;
  } else if (key == '4') {
    batchShots = 100;
  } else if (key == '5') {
    batchShots = 200;
  } else if (key == '6') {
    batchShots = 500;
  }

  if (key == 's') {
    save("Day_052.png");
  }
}
