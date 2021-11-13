PVector v1;
PVector v2;
PVector v3;
PGraphics pg;
PVector point;

class Test {

  void setup() {
    v1 = new PVector(100, 200);
    v2 = new PVector(600, 700);
    v3 = PVector.sub(v2, v1);
    pg = createGraphics(width, height);

    stroke(0);
    strokeWeight(1);
  }

  void draw() {
    background(255);

    pg.beginDraw();
    pg.fill(0, 255, 0);
    pg.rect(300, 300, 300, 300);
    pg.endDraw();
    image(pg, 0, 0);

    pg.loadPixels();
    for (int i = 0; i < height; i++) {
      for (int j = 0; j < width; j++) {
        int index = width * i + j;
        point = new PVector(j, i);
        float angle = PVector.angleBetween(point, v1);
        float value = sin(angle);
        if (value > 0) {
          pg.pixels[index] = color(0, 255, 0);
        } else if (value == 0) {
          pg.pixels[index] = color(255, 0, 0);
        } else {
          pg.pixels[index] = color(0, 0, 255);
        }
      }
    }
    pg.updatePixels();

    line(0, 0, v1.x, v1.y);
    line(0, 0, v2.x, v2.y);
    line(v1.x, v1.y, v2.x, v2.y);

    fill(255);
    circle(0, 0, 10);
    circle(v1.x, v1.y, 10);
    circle(v2.x, v2.y, 10);




    float a = PVector.angleBetween(v1, v2);
    println(degrees(a));
  }
}