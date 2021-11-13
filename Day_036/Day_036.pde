Test test;
Test2 test2;
void setup() {
  size(800, 800);
  smooth(2);

  test = new Test();
  test.setup();

  test2 = new Test2();
  test2.setup();
}


void draw() {
  // test.draw();
  test2.draw();
}

void keyPressed() {
  test2.keyPressed();
}