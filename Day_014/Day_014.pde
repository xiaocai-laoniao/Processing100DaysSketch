float angleX = 0;
float angleY = 0;
float angleZ = 0;

float boxSize = 20;
float boxSpace = 20;
float unit = boxSize + boxSpace;
void setup() {
  size(1000, 800, P3D);
}


void draw() {
  background(255);
  stroke(0);
  noFill();
  //fill(255, 0, 0);

  for (int i = 0; i < 10; i ++) {
    for (int j = 0; j < 10; j++) {
      for (int k = 0; k < 10; k++) {
        pushMatrix();
        translate(width / 2 - unit * 5 + unit * i, height / 2 - unit * 5 + unit * j, unit * k);
        rotateX(angleX);
        rotateY(angleY);
        rotateZ(angleZ);
        box(boxSize);
        popMatrix();
      }
    }
  }

  angleY += 0.01;
  angleX += 0.02;
  angleZ += 0.03;
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_014.png");
  }
}
