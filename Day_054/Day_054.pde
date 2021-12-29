ArrayList<PVector> points;
final float delta = 0.05;
final float startX = -5;
final float startY = -5;
final float endX = -1 * startX;
final float endY = -1 * startY;
final float scale = 50.0;
void setup() {
  size(1000, 800, P3D);
  stroke(255);
  strokeWeight(1);
  noFill();

  points = new ArrayList<PVector>();
}

void draw() {
  background(0);

  points.clear();

  pushMatrix();
  translate(width / 2, height / 2, 0);
  if (mousePressed) {
    rotateX(map(mouseY, 0, height, PI, -PI));
    rotateY(map(mouseX, 0, width, -PI, PI));
  }


  for (float x = startX; x < endX; x += delta) {
    for (float y = startY; y < endY; y += delta) {
      float z = getZ(x, y);
      points.add(new PVector(x, y, z));
    }
  }


  for (int i = 0; i < points.size(); i++) {
    PVector loc = points.get(i);
    point(loc.x * scale, loc.y * scale, loc.z * scale);

    float x = startX + i / ((endY - startY) / delta) * delta;
    float y = startY + i % ((endY - startY) / delta) * delta;
    float z = loc.z;

    float x2 = x + delta;
    float y2 = y;
    float z2 = getZ(x2, y2);
    line(x * scale, y * scale, z * scale, x2 * scale, y2 * scale, z2 * scale);

    float x3 = x;
    float y3 = y + delta;
    float z3 = getZ(x3, y3);
    line(x * scale, y * scale, z * scale, x3 * scale, y3 * scale, z3 * scale);
  }

  popMatrix();
}

float getZ(float x, float y) {
  return (20 + pow(x, 2) + pow(y, 2) - 10 * (cos(2 * PI * x) + cos(2 * PI * y))) * 0.04;
}

void keyPressed() {
  if (key == 's') {
    save("Day_054.png");
  }
}
