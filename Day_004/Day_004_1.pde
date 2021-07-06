class Demo1 {
  void setup() {
    smooth();
    background(0);
  }


  void draw() {
    background(0);

    drawLine();
  }

  void drawLine() {
    translate(width/2, height/2);
    stroke(0, 255, 0);
    strokeWeight(5);
    line(-200, -200, 200, 200);
    filter(BLUR, 3);
  }

  void drawCircle() {
    translate(width/2, height/2);
    noStroke();
    fill(255, 0, 255);
    circle(0, 0, 200);
    filter(BLUR, 6);
  }
}
