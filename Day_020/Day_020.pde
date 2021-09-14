float minR = 50;
float maxR = width / 2;
float angle = 0;
float r = minR;
float x;
float y;
float speedX;
float speedY;
void setup() {
  size(1000, 800, P3D);
  background(0);

  x = width / 2;
  y = height / 2;
  speedX = random(5, 10);
  speedY = random(5, 10);
}

void draw() {
  background(0);

  noStroke();
  x += speedX;
  y += speedY;

  if (x >= width || x <= 0) {
     speedX *= -1; 
  }
  if (y >= height || y <= 0) { 
    speedY *= -1; 
  }

  spotLight(51, 102, 126, x, y, 40, -1, 0, 0, PI/2, 2);

  for (float i = 0; i < width; i += 100) {
    for (float j = 0; j < height; j += 100) {
      pushMatrix();
      translate(i, j, 0);
      sphere(40);
      popMatrix();
    }
  }
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_020.png");
  }
}
