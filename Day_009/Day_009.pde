PGraphics ballLayer;

color ballColor = color(255, 0, 0);
float ballSize = 40.0;
PVector ballLocation;
PVector ballSpeed;
float ballSpeedScale;

color bgColor = color(255,255,146);

enum emotion {
  normal, // 普通
  shocked, // 惊讶
  angry // 生气
}

emotion currentEmotion = emotion.normal;  

void setup() {
  size(1000, 800);
  smooth();

  ballLayer = createGraphics(width, height);
  ballLayer.smooth();

  ballLocation = new PVector(random(width), random(height));
  ballSpeedScale = random(3, 5);
  ballSpeed = PVector.random2D().mult(ballSpeedScale);
}


void draw() {
  background(bgColor);

  // 小球层
  drawBallLayer();
  image(ballLayer, 0, 0);
  
  // 左眉毛
  drawEyebrow(width / 2 - 80, height / 2 - 80, true);
  // 右眉毛
  drawEyebrow(width / 2 + 80, height / 2 - 80, false);
  // 左眼
  drawEye(width / 2 - 80, height / 2, 100, 40);
  // 右眼
  drawEye(width / 2 + 80, height / 2, 100, 40);
  // 嘴巴
  drawMouse(width / 2, height / 2 + 120);
  // 文本说明
  drawText();
}

void drawBallLayer() {
  ballLayer.beginDraw();
  ballLayer.fill(red(bgColor), green(bgColor), blue(bgColor), 50);
  ballLayer.rect(0, 0, width, height);

  // 更新小球位置
  ballLocation.add(ballSpeed);
  // 检测小球边界，别出界了
  checkBallBoundary();
  ballLayer.fill(ballColor);
  ballLayer.noStroke();
  ballLayer.circle(ballLocation.x, ballLocation.y, ballSize);
  ballLayer.endDraw();
}

void checkBallBoundary() {
  // 修改x轴速度方向，反弹回去
  if (ballLocation.x > width || ballLocation.x < 0) {
    ballSpeed.x *= -1;
  }
  // 修改y轴速度方向，反弹回去
  if (ballLocation.y > height || ballLocation.y < 0) {
    ballSpeed.y *= -1;
  }
}

void drawEye(float x, float y, float eyeSize, float pupilSize) {
  // 瞳孔的跟随
  PVector pupilVec = ballLocation.copy();
  PVector eyeVec = new PVector(x, y);
  pupilVec.sub(eyeVec);
  pupilVec.limit((eyeSize - pupilSize) / 2);
  pupilVec.add(eyeVec);

  stroke(0);
  strokeWeight(20);

  if (currentEmotion == emotion.angry) {
    fill(255, 0, 0); // 生气状态眼球颜色
  } else {
    fill(255);
  }
  // 眼-大圆
  circle(x, y, eyeSize);

  fill(0);
  // 瞳孔
  circle(pupilVec.x, pupilVec.y, pupilSize);

  noStroke();
  fill(255);
  // 瞳孔高光
  circle(pupilVec.x - 10, pupilVec.y - 10, 20);
}

void drawMouse(float x, float y) {
  strokeWeight(20);
  stroke(0);

  if (currentEmotion == emotion.normal) {
    line(x - 50, y, x + 50, y);
  } else if (currentEmotion == emotion.shocked) {
    ellipseMode(CENTER);
    fill(255);
    ellipse(x, y, 50, 100);
  } else if (currentEmotion == emotion.angry) {
    line(x - 50, y, x + 50, y - 50);
  }
}

// isLeft 是否是左眉毛，区分左右是为了绘制shocked、angry状态下眉毛的左右倾斜情况
void drawEyebrow(float x, float y, boolean isLeft) {
  strokeWeight(15);
  stroke(0);
  if (currentEmotion == emotion.normal) {
    line(x - 50, y, x + 50, y);
  } else if (currentEmotion == emotion.shocked) {
    if (isLeft) {
      line(x - 50, y + 20, x + 50, y - 50);
    } else {
      line(x - 50, y - 50, x + 50, y + 20);
    }
  } else if (currentEmotion == emotion.angry) {
    if (isLeft) {
      line(x - 50, y - 50, x + 50, y + 20);
    } else {
      line(x - 50, y + 20, x + 50, y - 50);
    }
  }
}

void drawText() {
  fill(0);
  PFont font = createFont("STSongti-SC-Regular", 20);
  textFont(font);
  text("情绪控制：\n1. 数字1正常情绪\n2. 数字2震惊情绪\n3. 数字3生气情绪", 10, 10, width, 300);
  text(getEmotion(), width/2, 10, 100, 30);
}


void keyPressed() {
  switch (key) {
    case 's':
    case 'S':
    {
      save("Day_009.png");
      break;
    }
    case '1':
    {
      currentEmotion = emotion.normal;
      ballSpeed.normalize();
      ballSpeedScale = random(5, 10); // 中速
      ballSpeed.mult(ballSpeedScale);
      break;
    }
    case '2':
    {
      currentEmotion = emotion.shocked;
      ballSpeed.normalize();
      ballSpeedScale = random(0.5, 1); // 低速
      ballSpeed.mult(ballSpeedScale);
      break;
    }
    case '3':
    {
      currentEmotion = emotion.angry;
      ballSpeed.normalize();
      ballSpeedScale = random(10, 20); // 高速
      ballSpeed.mult(ballSpeedScale);
      break;
    }
  }
}

String getEmotion() {
  if (currentEmotion == emotion.normal) {
    return "正常";
  } else if (currentEmotion == emotion.shocked) {
    return "吃惊";
  } else if (currentEmotion == emotion.angry) {
    return "生气";
  } else {
    return "";
  }
}