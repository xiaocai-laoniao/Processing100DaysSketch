float angle = 0;
float lineLen = 120;
void setup() {
  size(500, 500);
}

void draw() {
  background(255);
  fill(0);

  translate(width / 2, 10);
  angle = radians(45) * sin(frameCount * 0.05);
  float posx = lineLen * sin(angle);
  float posy = lineLen * cos(angle);
  line(0, 0, posx, posy);

  circle(posx, posy, 10);
}
