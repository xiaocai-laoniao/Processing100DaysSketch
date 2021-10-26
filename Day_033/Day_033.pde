float angleZ = 0;
void setup() {
  size(600, 600, P3D);
  frameRate(120);
}

void draw() {
  background(0);

  translate(width / 2, height / 5 * 3);
  rotateX(radians(-45));

  stroke(255);
  noFill();

  int ringsCount = 75;

  for (int i = 0; i < ringsCount; i++) {

    float r = map(sin(radians(frameCount)), -1, 1, 0, 255);
    float g = map(i, 0, ringsCount, 0, 255);
    float b = map(cos(radians(frameCount)), -1, 1, 0, 255);
    stroke(r, g, b);

    rotateZ(radians(i * 5 + angleZ));

    beginShape();
    for (int j = 0; j < 360; j += 60) {
      float rad = i * 3;
      float x = rad * cos(radians(j));
      float y = rad * sin(radians(j));
      float z = sin(radians(frameCount * 2 + i * 5)) * 50;
      vertex(x, y, z);
    }

    endShape(CLOSE);
  }
  angleZ += 0.01;

  //saveFrame("/Users/childhoodandy/Downloads/Dev/imgs/frames-####.jpg");
}

void keyPressed() {
  if (key == 's') {
    save("Day_033.png");
  }
}
