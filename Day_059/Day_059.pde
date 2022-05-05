PImage img;
float tiles = 100;
float tileSize;
void setup() {
  size(800, 800, P3D);

  tileSize = width / tiles;
  img = loadImage("joker2.jpeg");
  img.resize(width, height);
  sphereDetail(3);
}

void draw() {
  background(#FAF3DD);
  
  //fill(0);
  noStroke();

  pushMatrix();
  translate(width / 2, height / 2);
  rotateX(map(mouseY, 0, height, PI, -PI));
  rotateY(map(mouseX, 0, width, -PI, PI));
  
  for (int x = 0; x < tiles; x++) {
    for (int y = 0; y < tiles; y++) {
      color c = img.get(int(x * tileSize), int(y * tileSize));
      float scale = map(brightness(c), 0, 255, 1, 0);
      float z = map(scale, 1, 0, -100, 100);

      fill(c);
      push();
      translate(x * tileSize - width / 2, y * tileSize - height / 2, z);
      //ellipse(0, 0, tileSize * scale, tileSize * scale);
      sphere(tileSize * scale * 0.8);
      //box(tileSize * scale * 0.8, tileSize * scale * 0.8, tileSize * scale * 8);
      pop();
    }
  }
  
  popMatrix();
}
