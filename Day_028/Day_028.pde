int index = 0;
int depth = 0;
void setup() {
  size(800, 800);
}

void draw() {
  background(255);
  drawCircle(width/2, height/2, width);
  //drawCircle2(width/2, height/2, width - 10, 0);

  printNumbers(10);
  noLoop();
}

void printNumbers(int a) {
  if (a <= 0) {
    return;
  }

  println("before:", a);
  printNumbers(a-1);
  println("after:", a);
}

void drawCircle(int x, int y, float d) {
  if (d < 120) {
    return;
  }

  drawCircle(x, y, d * 0.75);

  noFill();
  circle(x, y, d);
  fill(255, 0, 0);
  text(index, x + (d / 2 - 10) * cos(0), y + (d / 2 - 10) * sin(0));
  index += 1;
}


void drawCircle2(int x, int y, float d, int depth) {

  if (depth > 4) {
    return;
  }

  noFill();
  stroke(0, 0, 255);
  circle(x, y, d);
  fill(255, 0, 0);
  text(depth, x + (d / 2 - 10) * cos(PI), y + (d / 2 - 10) * sin(PI));


  drawCircle2(x, y, d * 0.75, depth + 1);

  noFill();
  stroke(255, 0, 255);
  rect(x - d / 2, y - d / 2, d, d);
  fill(255, 0, 0);
  textAlign(LEFT, TOP);
  text(4 - depth, x - d / 2, y - d / 2);
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_028.png");
  }
}