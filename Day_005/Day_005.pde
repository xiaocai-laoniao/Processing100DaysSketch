float r = 200;
float angle = PI / 6;
float startAngle = PI / 4 * 3; float rotateSpeed = 0.01;
void setup() {
  size(500, 500);
}


void draw() {
  background(255);

  startAngle += rotateSpeed;
  // wrongDraw();

  rightDraw();
}


// 求出三角形边和圆的切点，让圆弧的起止点在两个切点上
void rightDraw() {
  translate(width/2, height/2);
  noFill();
  stroke(0);
  circle(0, 0, r * 2);

  // 需要填充色的话，反注释下面两句
  // noStroke();
  // fill(255, 0, 0);
  beginShape();
  float x0 = 0;
  float y0 = 0;
  float x1 = r * cos(startAngle);
  float y1 = r * sin(startAngle);
  float x2 = r * cos(startAngle + angle);
  float y2 = r * sin(startAngle + angle);
  vertex(x0, y0);
  vertex(x1, y1);
  vertex(x2, y2);
  endShape(CLOSE);

  float outerCircleR = abs(r * tan(angle / 2));
  // 内切圆圆心方向
  PVector outerCircleCenterVector = (new PVector(x1, y1)).rotate(angle/2);
  // 归一
  outerCircleCenterVector.normalize();
  // 乘以长度（内切圆圆心到坐标系原点距离-坐标系已经移动到舞台中央了）
  outerCircleCenterVector.mult(r / cos(angle/2));
  translate(outerCircleCenterVector.x, outerCircleCenterVector.y);
  circle(0, 0, outerCircleR * 2);
}

// 在两个图像的交界处，并不是平滑过渡的，而是有一个钝角
void wrongDraw() {
  // noStroke();
  // fill(255, 0, 0);

  translate(width/2, height/2);
  beginShape();
  float x0 = 0;
  float y0 = 0;
  float x1 = r * cos(startAngle);
  float y1 = r * sin(startAngle);
  float x2 = r * cos(startAngle + angle);
  float y2 = r * sin(startAngle + angle);
  vertex(x0, y0);
  vertex(x1, y1);
  vertex(x2, y2);
  endShape(CLOSE);

  float circleCenterX = lerp(x1, x2, 0.5);
  float circleCenterY = lerp(y1, y2, 0.5);
  float outerCircleR = abs(r * sin(angle / 2));
  translate(circleCenterX, circleCenterY);
  float rotation = PI - (PI - startAngle + PI * 0.5 - angle * 0.5);
  rotate(rotation);
  arc(0, 0, 2 * outerCircleR, 2 * outerCircleR, 0, PI);

  // 该方式绘制会和三角形有重叠部分 ，效果不太好，建议用arc
  // circle(0, 0, 2 * outerCircleR);
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_005.png");
  }
}
