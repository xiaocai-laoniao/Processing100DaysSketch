float cameraOriginX = 0;
float cameraOriginY = 0;
float cameraSpeed = 5;
boolean cameraMovingLeft = false;
boolean cameraMovingRight = false;
boolean cameraMovingUp = false;
boolean cameraMovingDown = false;
PImage bgImage;

void setup() {
  size(500, 500);
  bgImage = loadImage("bg.jpeg");
}

void draw() {
  background(0);
  
  pushMatrix();

  updateCamera();

  translate(cameraOriginX, cameraOriginY);
  
  image(bgImage, 0, 0);

  fill(255);
  rect(0, 0, 30, 30);

  fill(255, 255, 0);
  circle(width / 2, height / 2, 100);

  fill(255, 0, 0);
  rect(width, height, 100, 100);

  fill(0, 255, 0);
  rect(width, 0, 100, 100);

  fill(0, 0, 255);
  rect(0, height, 100, 100);

  popMatrix();
}

void updateCamera() {
  if (cameraMovingLeft) {
    cameraOriginX -= cameraSpeed;
  }
  if (cameraMovingRight) {
    cameraOriginX += cameraSpeed;
  }
  if (cameraMovingUp) {
    cameraOriginY -= cameraSpeed;
  }
  if (cameraMovingDown) {
    cameraOriginY += cameraSpeed;
  }
}

void keyPressed() {
  if (key == CODED) {
    if (keyCode == LEFT) {
      cameraMovingLeft = true;
    }
    if (keyCode == RIGHT) {
      cameraMovingRight = true;
    }
    if (keyCode == UP) {
      cameraMovingUp = true;
    }
    if (keyCode == DOWN) {
      cameraMovingDown = true;
    }
  }
}

void keyReleased() {
  if (key == CODED) {
    if (keyCode == LEFT) {
      cameraMovingLeft = false;
    }
    if (keyCode == RIGHT) {
      cameraMovingRight = false;
    }
    if (keyCode == UP) {
      cameraMovingUp = false;
    }
    if (keyCode == DOWN) {
      cameraMovingDown = false;
    }
  }
}
