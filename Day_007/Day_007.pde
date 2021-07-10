import processing.video.*;
import shiffman.box2d.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.joints.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.collision.shapes.Shape;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;

Box2DProcessing box2d;
ArrayList<Particle> particles;
Platform platform;

Capture video;
color targetColor;
float targetColorR, targetColorG, targetColorB;

void setup() {
  size(640, 480);
  video = new Capture(this, width, height, 30);
  smooth();

  box2d = new Box2DProcessing(this);
  box2d.createWorld();

  particles = new ArrayList<Particle>();

  platform = new Platform(width/2, height/2);

  targetColor = color(0, 255, 0);
  targetColorR = red(targetColor);
  targetColorG = green(targetColor);
  targetColorB = blue(targetColor);
  video.start();
}

void draw() {
  if (video.available()) {
    video.read();
  }

  image(video, 0, 0);
  video.loadPixels();

  float targetX = 0;
  float targetY = 0;
  float colorDistance  = 300;
  for (int x = 0; x < video.width; x++) {
    for (int y = 0; y < video.height; y++) {
      int loc = x + y * video.width;
      color videoColor = video.pixels[loc];
      float r1 = red(videoColor);
      float g1 = green(videoColor);
      float b1 = blue(videoColor);

      float d = dist(r1, g1, b1, targetColorR, targetColorG, targetColorB);
      if (d < colorDistance) {
        colorDistance = d;
        targetX = x;
        targetY = y;
      }
    }
  }

  if (colorDistance < 15) {
    drawTargetColorShape(targetX, targetY);
  }

  if (random(1) < 0.1) {
    float r = random(4, 8);
    particles.add(new Particle(random(width/2 - 50, width/2 + 50), -20, r));
  }


  box2d.step();

  for (int i = particles.size()-1; i >= 0; i--) {
    Particle p = particles.get(i);
    p.display();
    if (p.done()) {
      particles.remove(i);
    }
  }

  if (targetX != 0 || targetY != 0) {
    platform.display(targetX, targetY, targetColor);
  }
}

void drawTargetColorShape(float targetX, float targetY) {
  fill(targetColor);
  strokeWeight(2.0);
  stroke(255);
  rectMode(CENTER);
  rect(targetX, targetY, 200, 30);
}

void mousePressed() {
  int loc = mouseX + mouseY * video.width;
  targetColor = video.pixels[loc];
  targetColorR = red(targetColor);
  targetColorG = green(targetColor);
  targetColorB = blue(targetColor);
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_007.png");
  }
}
