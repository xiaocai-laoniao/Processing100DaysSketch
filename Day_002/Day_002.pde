int rippleCount = 3;
Ripple[] ripples;
void setup() {
  size(500, 500);
  background(255);

  ripples = new Ripple[rippleCount];
  for (int i = 0; i < rippleCount; i++) {
    PVector location = new PVector(random(width), random(height));
    Ripple ripple = new Ripple(location, random(50), 200, 3, random(0.5, 1.4));
    ripples[i] = ripple;
  }
}

void draw() {
  background(255);

  for (Ripple ripple : ripples) {
    ripple.update();
    ripple.display();
  }
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_002.png");
  }
}
