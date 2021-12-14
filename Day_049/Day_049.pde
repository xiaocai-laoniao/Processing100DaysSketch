void setup() {
  size(400, 400, P3D);
  stroke(255, 0, 0);
  strokeWeight(2);
}

void draw() {
  background(0);

  translate(width / 2, height / 2, 0);
  fill(255, 0, 0);
  rotateX(0);
  rotateY(0);
  if (mousePressed) {
    float angleY = map(mouseX, 0, width, -PI, PI);
    float angleX = map(mouseY, 0, height, -PI, PI);
    rotateY(angleY);
    rotateX(-angleX);
  }

  line(-width / 2, 0, width / 2, 0);
  line(0, -height / 2, 0, height / 2);
  circle(0, 0, 50);
  for (float x = 0; x < 200; x += 0.01) {
    point(x, -sin(0.1 * x) * 30, 20);
  }
}

void keyPressed() {
  if (key == 's') {
    save("Day_049.png");
  }
}
