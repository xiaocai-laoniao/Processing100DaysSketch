int max_depth = 7;  // 最大递归深度
float noise_scale = 1.0; // 噪声尺度
float n = 0.002;  // 噪声变化速度
float d = 20.0;  // 递归深度变化速度
float r = 100.0;  // 圆圈大小
float speed = 0.1;  // 动画速度

void setup() {
  size(800, 800);
  background(255);
  noStroke();
  smooth();
  frameRate(30);
}

void draw() {
  background(255, 255, 255);
  float depth = map(sin(frameCount * speed), -1, 1, 0, max_depth); // 根据帧数变化计算当前递归深度
  noise_scale += n;  // 更新噪声尺度
  d += n;  // 更新递归深度变化速度
  r = map(sin(frameCount * speed), -1, 1, 50, 150); // 根据帧数变化计算当前圆圈大小
  float x = width / 2;
  float y = height / 2;
  drawSierpinski(x, y, r, depth);  // 绘制Sierpinski三角形
}

void drawSierpinski(float x, float y, float r, float depth) {
  if (depth <= 0) {
    fill(255, 0, 0); // 最后一层填充红色
    ellipse(x, y, r, r);
  } else {
    for (int i = 0; i < 3; i++) {
      float angle = i * TWO_PI / 3.0;
      float x2 = x + r * cos(angle);
      float y2 = y + r * sin(angle);
      drawSierpinski(x2, y2, r / 2.0, depth - 1);  // 递归绘制
    }
  }
}
