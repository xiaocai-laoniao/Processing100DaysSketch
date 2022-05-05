float t = 0;

int path = 0;
void setup() {
  size(1000, 1000);
}

void draw() {
  background(#000009);

  noFill();

  stroke(#731DD8);
  stroke(#0FF4C6);
  strokeWeight(4);

  // 贝塞尔曲线

  bezier(452, 179, 200, 203, 229, 694, 449, 719);
  bezier(450, 180, 693, 205, 678, 697, 450, 718);

  // https://processing.org/reference/bezierPoint_.html
  // 根据 t 值比例，计算 x 和 y

  float x = 0;
  float y = 0;

  if (path == 0) {
    x = bezierPoint(452, 200, 229, 449, t);
    y = bezierPoint(179, 203, 694, 719, t);
  } else if (path == 1) {
    x = bezierPoint(450, 678, 693, 450, t);
    y = bezierPoint(718, 697, 205, 180, t);
  }

  noStroke();
  fill(#F1DB4B);

  circle(x, y, 20);
  t += 0.01;

  if (t >= 1) {
    t = 0;
    if (path == 0) {
      path = 1;
    } else if (path == 1) {
      path = 0;
    }
  }
}
