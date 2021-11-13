PVector zeroVec;
PVector test2_v1;
PVector test2_v2;

float a, b;
float a2, b2;
final int CIRCLE_SIZE = 8;

PGraphics textLayer;
PGraphics textPixelLayer;
PGraphics lineLayer;

int speed = 0;


class Test2 {

  void setup() {
    zeroVec = new PVector(0, 0);
    test2_v1 = new PVector(600, 400);
    test2_v2 = new PVector(300, 400);

    textLayer = createGraphics(width, height);
    textPixelLayer = createGraphics(width, height);
    lineLayer = createGraphics(width, height);
  }

  void draw() {
    background(255);
    drawText();
    drawLines();
  }


  void drawText() {
    textLayer.beginDraw();
    textLayer.background(255);
    textLayer.textSize(50);
    textLayer.fill(0);
    textLayer.noStroke();
    textLayer.text("1", width / 2, height / 2);
    textLayer.endDraw();

    textLayer.loadPixels();
    textPixelLayer.beginDraw();
    for (int j = 0; j < textLayer.height; j++) {
      for (int i = 0; i < textLayer.width; i++) {
        color c = textLayer.pixels[j * textLayer.width + i];
        if (red(c) != 255) {
          textPixelLayer.fill(c);
          textPixelLayer.noStroke();
          textPixelLayer.rect(i + speed, j + speed, 1, 1);
        }
      }
    }
    textPixelLayer.endDraw();

    image(textPixelLayer, 0, 0);
  }

  void drawLines() {
    lineLayer.beginDraw();
    lineLayer.clear();

    PVector mouseVec = new PVector(mouseX, mouseY);
    float headingAngle = mouseVec.heading();
    float angle = PVector.angleBetween(mouseVec, test2_v1);
    float value = sin(angle);

    lineLayer.line(0, 0, mouseX, mouseY);

    lineLayer.noFill();
    lineLayer.circle(0, 0, CIRCLE_SIZE);


    lineLayer.line(0, 0, test2_v1.x, test2_v1.y);
    lineLayer.circle(test2_v1.x, test2_v1.y, CIRCLE_SIZE);


    lineLayer.noFill();
    PVector point1 = new PVector(200, 100);
    PVector point2 = PVector.add(point1, test2_v2);

    lineLayer.line(point1.x, point1.y, point2.x, point2.y);
    lineLayer.circle(point1.x, point1.y, CIRCLE_SIZE);
    lineLayer.circle(point2.x, point2.y, CIRCLE_SIZE);

    PVector sub2 = PVector.sub(point2, point1);
    a2 = sub2.y / sub2.x;
    b2 = point2.y - a2 * point2.x;

    float y2 = a2 * mouseX + b2;
    if (mouseY < y2) {
      lineLayer.fill(0, 0, 255);
    } else if (abs(mouseY - y2) <= 1) {
      lineLayer.fill(0, 255, 0);
    } else {
      lineLayer.fill(255, 0, 0);
    }
    
    lineLayer.circle(mouseX, mouseY, CIRCLE_SIZE);

    lineLayer.endDraw();

    image(lineLayer, 0, 0);

  }

  void startCut() {
    println("cut");
    speed = 1;
  }

  void keyPressed() {
    println("key pressed");
    if (key == ' ') {
      startCut();
    }
  }
}