void setup() {
  size(800, 800);
  
  stroke(255, 0, 0);
  fill(0, 255, 255);
}

void draw() {
  background(0);
  
  pushMatrix();
  translate(width / 2, height / 3);
  float scale = map(mouseX, 0, width, 0.5, 8); 
  scale(scale);
  strokeWeight(4);
  circle(0, 0, 30);
  textSize(30);
  text("scale", 0, 30);
  popMatrix();
  
  pushMatrix();
  translate(width / 2, height / 3 * 2);
  scale(scale);
  strokeWeight(4 / scale);
  circle(0, 0, 30);
  textSize(30 / scale);
  text("scale", 0, 30);
  popMatrix();
}
