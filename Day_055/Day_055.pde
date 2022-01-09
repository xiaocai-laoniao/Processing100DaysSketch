int batchSandCount = 600;
float sandRange = 10;

final color SAND_COLOR_1 = #AC9730;
final color SAND_COLOR_2 = #B79733;


void setup() {
  size(800, 800);
  background(255);
}


void draw() {
  if (!mousePressed) {
    return;
  }

  float mouseXSpeed = abs(mouseX - pmouseX);
  float mouseYSpeed = abs(mouseY - pmouseY);
  float mouseSpeed = max(mouseXSpeed, mouseYSpeed);
  mouseSpeed = constrain(mouseSpeed, 0, 100);
  sandRange = map(mouseSpeed, 0, 100, 10, 100);
  batchSandCount = int(map(mouseSpeed, 0, 100, 600, 1000));

  for (int i = 0; i < batchSandCount; i++) {
    float posx = randomGaussian() * sandRange;
    float posy = randomGaussian() * sandRange;

    if (random(1) < 0.5) {
      stroke(SAND_COLOR_1);
    } else {
      stroke(SAND_COLOR_2);  
    }
    point(mouseX + posx, mouseY + posy);
  }
}

void keyPressed() {
  if (key == 'c') {
    background(255);
  }
}
