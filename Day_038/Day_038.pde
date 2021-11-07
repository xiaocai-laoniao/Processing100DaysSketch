PImage logoImage;
PShape logoShape;

void setup() {
  size(800, 200);

  logoImage = loadImage("xiaocai.png");
  float ratio = logoImage.height / logoImage.width;
  logoImage.resize(800, int(800 * ratio));

  noStroke();
}


void draw() {
  background(255);

  translate(0, height / 2 - 120);
  logoImage.loadPixels();
  for (int i = 0; i < logoImage.height; i++) {
    for (int j = 0; j < logoImage.width; j++) {
      color c = logoImage.pixels[i * logoImage.width + j];
      if (isFontPixel(c)) {
        fill(255, 0, 0);
        rect(j, i, sin(frameCount * 0.1) * 2 + 4, sin(frameCount * 0.1) * 2 + 4);
      } else {
        fill(255);
      }
    }
  }
}

boolean isFontPixel(color c) {
  //return dist(red(c), green(c), blue(c), 0, 0, 0) < 10;
  return red(c) < 5;
}
