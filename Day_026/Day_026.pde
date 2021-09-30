float scaleX = 1;
float scaleY = 1;
float t = 0;
void setup() {
  size(500, 500);
}

void draw() {
  background(255);

  pushMatrix();
  translate(width / 2, height / 2);
  fill(0);
  textSize(128);
  textAlign(CENTER, CENTER);
  scaleX = noise(t) * 3;
  scaleY = noise(t + 0.1) * 3;
  scale(scaleX, scaleY);
  text("6", 0, 0);
  popMatrix();

  t += 0.02;
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_026.png");
  }
}