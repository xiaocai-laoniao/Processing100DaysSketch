PGraphics pg1;
PGraphics pg2;
PGraphics pg3;


void setup() {
  size(800, 800);

  pg1 = createGraphics(width / 2, height);     // 图层1的大小为 宽/2 高
  pg2 = createGraphics(width / 2, height / 2); // 图层2的大小为 宽/2 高/2
  pg3 = createGraphics(width / 2, height / 2); // 图层3的大小为 宽/2 高/2
}

void draw() {
  background(255, 255, 0); // 黄色的背景

  pg1.beginDraw();
  pg1.background(255, 0, 0); // 红色的背景
  pg1.fill(0, 0, 255);
  pg1.circle(30, 30, 30);
  pg1.endDraw();

  pg2.beginDraw();
  pg2.clear(); // 每次清空绘制
  pg2.fill(0, 255, 0); // 绿色的矩形
  pg2.rect(100 + random(-5, 5), 100 + random(-5, 5), 100, 100);
  pg2.endDraw();

  pg3.beginDraw();
  pg3.fill(0, 20);
  pg3.rect(0, 0, width, height);
  pg3.fill(255, 0, 0);
  pg3.ellipse(100 + random(-10, 10), 100 + random(-10, 10), 40, 20);
  pg3.endDraw();

  image(pg1, 0, 0);               // 图层1位于画面左半部分
  image(pg2, width / 2, 0);     // 图层2位于右上角
  image(pg3, width / 2, height / 2); // 图层2位于右下角
}


void keyPressed() {
  if (key == 's') {
    save("Day_031.png");
  }
}
