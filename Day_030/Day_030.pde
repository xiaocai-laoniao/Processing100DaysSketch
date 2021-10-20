PShape p;
void setup() {
  size(800, 800);

  p = loadShape("fromExcalidraw.svg");
  shapeMode(CENTER);
}

void draw() {
  background(255);
  
  pushMatrix();
  
  fill(0);
  text(frameRate, 100, 20);
  
  translate(width / 2, height / 2);
  rotate(frameCount * 0.05);
  shape(p, 0, 0, 200, 200);

  popMatrix();
}

void keyPressed() {
  if (key == 's') {
    save("Day_030.png");
  }
}
