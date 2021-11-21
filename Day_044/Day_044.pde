ArrayList<PVector> points;

void setup() {
  size(800, 800);

  points = new ArrayList<PVector>();

  PVector startPoint = new PVector(random(800), random(800));
  points.add(startPoint);
}

void draw() {
  background(255);

  fill(0);
  if (points.size() == 1) {
    circle(points.get(0).x, points.get(0).y, 20);
  }
  for (int i = 1; i < points.size(); i++) {
    PVector point1 = points.get(i - 1);
    PVector point2 = points.get(i);
    line(point1.x, point1.y, point2.x, point2.y);
    circle(point1.x, point1.y, 20);
    circle(point2.x, point2.y, 20);
    
    float distance = PVector.dist(point1, point2);
    text(distance, point2.x - 30, point2.y - 30);
  }
}

void mouseClicked() {
  points.add(new PVector(mouseX, mouseY));
}
