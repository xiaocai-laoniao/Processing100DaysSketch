PFont font;
ArrayList<PVector> edgeVertices = new ArrayList<>();

void setup() {
  size(600, 600);
  font = createFont("STHeiti", 260);
  PShape shape = font.getShape('菜');

  for (int i = 0; i < shape.getVertexCount(); i++) {
    edgeVertices.add(shape.getVertex(i));
  }
}

void draw() {
  background(255);

  translate(width / 2 - 139, height / 2 + 78);
  strokeWeight(2);
  beginShape();
  for (PVector v : edgeVertices) {
    vertex(v.x, v.y);
    circle(v.x, v.y, 8);
  }
  endShape();
}

void keyPressed() {
 if (key == 's') {
  save("Day_037.png"); 
 }
}
