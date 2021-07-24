// study from https://gorillasun.de/blog/Perlin-Noise-Flow-Fields-in-Processing-Part-I

final ArrayList<ArrayList<GridAngle>> grid = new ArrayList<ArrayList<GridAngle>>();

final int xOff = 50;
final int yOff = 50;
final int spacing = 40;
final float noiseScale = 0.005;

class GridAngle {
  int x, y, r;
  float angle;
  color c;
  
  PVector v;
  
  GridAngle(int x_, int y_, int r_, float angle_) {
    x = x_;
    y = y_;
    
    angle = angle_;
    float h = map(angle, 0, TAU, 255, 0);
    float s = map(angle, 0, TAU, 0, 255);
    float b = map(angle, 0, TAU, 255, 0);
    c = color(h, s, b);
    r = r_;
    v = new PVector(x + r * cos(angle), y + r * sin(angle));
  }
  
  void display() {
    strokeWeight(4);
    stroke(c);
    line(x, y, v.x, v.y);
  }
}

void createGrid() {
  for (int x = xOff; x < width - xOff; x += spacing) {
    ArrayList<GridAngle> row  = new ArrayList<GridAngle>();
    for (int y = yOff; y < height - yOff; y += spacing) {
      float angle = map(noise(x * noiseScale, y * noiseScale), 0.0, 1.0, 0.0, TAU);
      
      row.add(new GridAngle(x, y, spacing / 2, angle));
    }
    grid.add(row);
  }
}

void setup() {
  size(1200, 800);
  createGrid();
  colorMode(HSB);
}

void draw() {
  background(0);
  for (int x = 0; x < grid.size(); x++) {
    for (int y = 0; y < grid.get(0).size(); y++) {
      grid.get(x).get(y).display();
    }
  }
  noLoop();
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_018.png");
  }
}
