import processing.svg.*;

void setup() {
  size(300, 180, SVG, "path.svg");
}

void draw() {
  beginShape();
  vertex(18, 3);
  vertex(46, 3);
  vertex(46, 40);
  vertex(61, 40);
  vertex(32, 68);
  vertex(3, 40);
  vertex(18, 40);
  endShape(CLOSE);
  
  println("Finished.");
  exit();
}
