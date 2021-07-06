class Demo3 {
  color c = color(255, 124, 0);
  float rMin = 20;
  float rMax = 40;
  float r = rMin;
  boolean grow = true;

  void setup() {
    frameRate(30);
    ellipseMode(CENTER);
    smooth();
    r = rMin;
  }

  void draw() {
    background(0);
    stroke(c);
    fill(c);
    ellipse(height/2, width/2, r, r);
    noFill();
    for (int i = 1; i < 20; i++) {
      stroke(red(c), green(c), blue(c), 255/i);
      strokeWeight(2);
      ellipse(height/2, width/2, r+i, r+i);
    }
    if ( grow ) {
      r += 8/frameRate;
      if ( r > rMax ) grow = false;
    } else {
      r -= 8/frameRate;
      if ( r < rMin ) grow = true;
    }
  }
}
