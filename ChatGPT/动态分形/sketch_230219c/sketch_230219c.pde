float angle = 0;
float speed = 0.02;
float len = 200;
float noiseScale = 0.01;
float noiseVal = 0;
float m = 10;

void setup() {
  size(500, 500);
  background(255);
  noFill();
  smooth();
  frameRate(30);
}

void draw() {
  background(255);
  translate(width/2, height/2);
  kochCurve(0, 0, len, angle);
  angle += speed;
  noiseVal = noise(frameCount * noiseScale) * m;
  len = map(noiseVal, 0, m, 50, 200);
}

void kochCurve(float x, float y, float len, float angle) {
  if (len > 1) {
    float newLen = len / 3;
    float a = angle;
    kochCurve(x, y, newLen, a);
    a += PI / 3;
    kochCurve(x + newLen * cos(a), y + newLen * sin(a), newLen, a);
    a -= 2 * PI / 3;
    kochCurve(x + newLen * cos(a), y + newLen * sin(a), newLen, a);
    a += PI / 3;
    kochCurve(x + newLen * cos(a) * 2, y + newLen * sin(a) * 2, newLen, a);
  } else {
    pushMatrix();
    rotate(angle);
    line(x, y, x + len, y);
    popMatrix();
  }
}
