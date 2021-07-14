import ddf.minim.*;
import javax.sound.sampled.*;

int count = 30;
float[] angles = new float[count];
float[] squareSizes = new float[count];
color[] squareColors = new color[count];
float[] squareStrokeWeights = new float[count];
color bgColor;

Minim minim;
AudioInput in;

void setup() {
  size(1000, 800);
  background(255);

  minim = new Minim(this);
  in = minim.getLineIn(Minim.MONO);

  stroke(0);
  rectMode(CENTER);
  colorMode(HSB);

  bgColor = color(random(255), random(255), 255);
  for (int i = 0; i < count; i++) {
    angles[i] = 0;
    squareSizes[i] = 300 - i * 10;
    squareColors[i] = color(random(255), random(255), 255);
    squareStrokeWeights[i] = map(i, 0, count, 10, 2);
  }
}

void resetColors() {
  bgColor = color(random(255), random(255), 255);
  for (int i = 0; i < count; i++) {
    squareColors[i] = color(random(255), random(255), 255);
  }
}

void draw() {
  background(bgColor);

  drawSquares(width / 2 - 250, height / 2);
  drawSquares(width / 2 + 250, height / 2);

  if (frameCount % 100 == 0) {
    resetColors();
  }
}

void drawSquares(float x, float y) {
  pushMatrix();
  translate(x, y);

  for (int i = 0; i < count; i++) {
    pushMatrix(); 

    rotate(radians(angles[i]));

    int index = floor(map(i, 0, count, 0, in.bufferSize()));
    float value = in.mix.get(index) * 12;
    float angleSpeeds = 0.2 + i * abs(value);
    angles[i] += angleSpeeds;

    strokeWeight(squareStrokeWeights[i]);
    fill(squareColors[i]);
    square(0, 0, squareSizes[i]);

    popMatrix();
  }

  popMatrix();
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_010.png");
  }
}
