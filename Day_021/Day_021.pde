float big_radius = 150;
float small_radius = 25;
float t = 0;
float angle = 0;
int circle_num = 30;
void setup() {
  size(500, 500);
}

void draw() {
  colorMode(RGB);
  background(0, 255, 255);
  
  noFill();
  stroke(0);
  strokeWeight(10);
  
  translate(width / 2, height / 2);
  
  noStroke();
  colorMode(HSB);
  for (int i = 0; i < circle_num; i ++) {
    float x = big_radius * cos(angle + TWO_PI / circle_num * i);
    float y = big_radius * sin(angle + TWO_PI / circle_num * i);
    float d = 20 + 10 * sin(t + TWO_PI / circle_num * i);
    float h = map(sin(t + TWO_PI / circle_num * i), -1, 1, 0, 100);
    float s = 150;
    float b = 200;
    fill(h, s, b);
    circle(x, y, d); 
  }
  
  t += 0.05;
  angle += 0.005;
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_021.png");
  }
}
