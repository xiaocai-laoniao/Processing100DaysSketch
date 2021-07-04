// 不规则图形遮罩

color color1 = color(255, 213, 0);
color color2 = color(255, 162, 0);
float r = 100;

int drawWay = 4;

PGraphics pg_content;
PGraphics pg_circleMask;
PGraphics pg_shapeMask;
PGraphics pg_fontMask;

void setup() {
  size(500, 500);

  pg_content = createGraphics(width, height);
  pg_circleMask = createGraphics(width, height);
  pg_shapeMask = createGraphics(width, height);
  pg_fontMask = createGraphics(width, height);
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_003.png");
  } else if (key == '1') {
    drawWay = 1;
    redraw();
  } else if (key == '2') {
    drawWay = 2;
    redraw();
  } else if (key == '3') {
    drawWay = 3;
    redraw();
  } else if (key == '4') {
    drawWay = 4;
    redraw();
  }
}

void draw() {
  background(255);
  
  switch (drawWay) {
    case 1:
      drawWithCircleMask();
      break;
    case 2:
      drawWithShapeMask();
      break;
    case 3:
      drawWithFontMask();
      break;
    case 4:
      drawWithNoMask();
      break;
  }
}

void drawWithCircleMask() {
  fill(0);
  text("1: 使用遮罩-circle", 20, 20, 200, 30);
  
  drawContent();
  drawCircleMask();
  pg_content.mask(pg_circleMask);
  

  image(pg_content, 0, 0);
  // image(pg_circleMask, 0, 0);
}

void drawContent() {
  pg_content.beginDraw();
  pg_content.pushMatrix();
  pg_content.translate(width/2 - r, height/2 - r);
  for(float i = 0; i < 2 * r; i+=1) {
    float start_x = 0;
    float end_x = 2 * r;
    float y = i;
    color c = lerpColor(color1, color2, i / (2 * r));
    pg_content.stroke(c);
    pg_content.strokeWeight(1);
    pg_content.line(start_x, y, end_x, y);
  }
  pg_content.popMatrix();

  pg_content.endDraw();
}

void drawCircleMask() {
  pg_circleMask.beginDraw();
  pg_circleMask.pushMatrix();
  pg_circleMask.background(0);
  pg_circleMask.translate(width / 2, height / 2);
  pg_circleMask.fill(255);
  pg_circleMask.circle(0, 0, 2 * r - 30);
  pg_circleMask.popMatrix();
  pg_circleMask.endDraw();
}

void drawWithShapeMask() {
  fill(0);
  text("2: 使用遮罩-不规则图形", 20, 20, 200, 30);

  drawContent();
  drawShapeMask();
  pg_content.mask(pg_shapeMask);

  image(pg_content, 0, 0);
  // image(pg_shapeMask, 0, 0);
}

void drawShapeMask() {
  pg_shapeMask.beginDraw();
  pg_shapeMask.pushMatrix();
  pg_shapeMask.beginShape();
  pg_shapeMask.background(0);
  pg_shapeMask.fill(255);
  pg_shapeMask.translate(width/2, height/2);
  pg_shapeMask.vertex(0 - r + 20, 0 - r + 30);
  pg_shapeMask.vertex(0, 0 + 10);
  pg_shapeMask.vertex(0 + 80, 0 - 60);
  pg_shapeMask.vertex(0 + 50, 0 + 20);
  pg_shapeMask.vertex(0 - r + 5, 0 + 10);
  pg_shapeMask.endShape();
  pg_shapeMask.popMatrix();
  pg_shapeMask.endDraw();
}

void drawWithFontMask() {
  fill(0);
  text("3: 使用遮罩-font", 20, 20, 200, 30);
  
  drawContent();
  drawFontMask();
  pg_content.mask(pg_fontMask);
  

  image(pg_content, 0, 0);
}

void drawFontMask() {
  pg_fontMask.beginDraw();
  pg_fontMask.pushMatrix();
  pg_fontMask.translate(width/2, height/2);
  pg_fontMask.background(0);
  pg_fontMask.fill(255);
  pg_fontMask.textAlign(CENTER);
  pg_fontMask.textSize(30);
  pg_fontMask.text("Hello Processing!", 0, 0);
  pg_fontMask.popMatrix();
  pg_fontMask.endDraw();
}

void drawWithNoMask() {
  fill(0);
  text("4: 直接绘制", 20, 20, 200, 30);

  noFill();
  translate(width/2, height/2);
  translate(0, -r);
  for(float i = 0; i < 2 * r; i+=1) {
    float half_line = sqrt(r * r - (i - r) * (i - r));
    float start_x = -half_line;
    float end_x = start_x + 2 * half_line;
    float y = i;
    color c = lerpColor(color1, color2, i / (2 * r));
    stroke(c);
    strokeWeight(1);
    line(start_x, y, end_x, y);
  }
}
