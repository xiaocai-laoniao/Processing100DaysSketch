float r = 50;
float rChanged = 20;
float angle = 0;
float d = 50.0;
float d2 = 50.0;

PGraphics graphics1;
PGraphics graphics2;
PGraphics graphics3;
PGraphics graphics4;

color[] colors;

void setup() {
  size(1000, 800);
  colors = new color[4];
  colors[0] = #EEB76B;
  colors[1] = #E2703A;
  colors[2] = #9C3D54;
  colors[3] = #310B0B;
  background(colors[0]);
  smooth();

  graphics1 = createGraphics(width, height);
  graphics1.smooth();
  graphics2 = createGraphics(width, height);
  graphics2.smooth();
  graphics3 = createGraphics(width, height);
  graphics3.smooth();
  graphics4 = createGraphics(width, height);
  graphics4.smooth();
}

void draw() {
  drawGraphics1();
  image(graphics1, 0, 0);

  drawGraphics2();
  image(graphics2, 0, 0);

  drawGraphics3();
  image(graphics3, 0, 0);

  drawGraphics4();
  image(graphics4, 0, 0);
}

// 绘制在左上部分
void drawGraphics1() {
  graphics1.beginDraw();
  graphics1.pushMatrix();
  graphics1.fill(colors[1]);
  graphics1.stroke(colors[2]);
  graphics1.translate(width/4, height/4);
  float x = r * cos(angle);
  float y = r * sin(angle);
  graphics1.ellipse(x, y, 80, 80);
  angle += 0.05;
  graphics1.popMatrix();
  graphics1.endDraw();
}

// 绘制在右上部分
void drawGraphics2() {
  if (rChanged > 400) {
    return;
  }
  graphics2.beginDraw();
  graphics2.pushMatrix();
  graphics2.fill(colors[2]);
  graphics2.stroke(colors[3]);
  graphics2.translate(width/4 * 3, height/4);
  float x = rChanged * cos(angle);
  float y = rChanged * sin(angle);
  graphics2.ellipse(x, y, 50, 50);
  angle += 0.05;
  rChanged += 0.2;
  graphics2.popMatrix();
  graphics2.endDraw();
}

// 绘制在左下部分
void drawGraphics3() {
  if (d < 0) {
    return;
  }
  graphics3.beginDraw();
  graphics3.pushMatrix();
  graphics3.fill(colors[2]);
  graphics3.stroke(colors[3]);
  graphics3.translate(width/4, height/4 * 3);
  float x = rChanged * cos(angle);
  float y = rChanged * sin(angle);
  graphics3.ellipse(x, y, d, d);
  angle += 0.05;
  rChanged += 0.02;
  d -= 0.05;
  graphics3.popMatrix();
  graphics3.endDraw();
}


// 绘制在右下部分
void drawGraphics4() {
  if (d2 > 100) {
    return;
  }
  graphics4.beginDraw();
  graphics4.pushMatrix();
  graphics4.fill(colors[1]);
  graphics4.stroke(colors[2]);
  graphics4.translate(width/4 * 3, height/4 * 3);
  float x = rChanged * cos(angle);
  float y = rChanged * sin(angle);
  graphics4.ellipse(x, y, d2, d2);
  angle += 0.05;
  rChanged += 0.02;
  d2 += 0.05;
  graphics4.popMatrix();
  graphics4.endDraw();
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_008.png");
  }
}
