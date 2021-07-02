color color1 = color(255, 213, 0);
color color2 = color(255, 162, 0);
float r = 100;

void setup() {
  size(500, 500);
}

void draw() {
  background(255);
  
  translate(width/2, height/2);
  translate(0, -r);
  for(float i = 0; i < 2 * r; i+=1) {
    float half_line = sqrt(r * r - (i - r) * (i - r));
    float start_x = -half_line;
    float end_x = start_x + 2 * half_line;
    float y = i;
    color c = lerpColor(color1, color2, i / (2 * r));
    stroke(c);
    strokeWeight(1);
    line(start_x, y, end_x, y);
  }
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_001.png");
  }
}
