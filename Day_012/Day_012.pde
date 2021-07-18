int drawType = 1;

void setup() {
  size(1000, 800);
}

void draw() {
  background(255);
  
  if (drawType == 1) noiseRGB();
  if (drawType == 2) noiseHSB();
}

void noiseRGB() {
  colorMode(RGB);
  loadPixels();

  for (int x = 0; x < width; x++) {
    for (int y = 0; y < height; y++) {
      float r = noise(x * 0.01, y * 0.01) * 476 - 113;
      float g = noise(x * 0.004 + 574, y * 0.002 + 1149) * 424;
      float b = noise(x * 0.010 + 129, y * 0.014 + 973) * 513;

      pixels[x + y * width] = color(r, g, b);
    }
  }

  updatePixels();
}

void noiseHSB() {
  colorMode(HSB, 255, 255, 255); 
  loadPixels();

  for (int x = 0; x < width; x++) {
    for (int y = 0; y < height; y++) {
      float h = noise(x * 0.01, y * 0.01) * 419 - 55;
      float s = noise(x * 0.002 + 285, y * 0.005 + 1314) * 400;
      float b = noise(x * 0.003 + 26, y * 0.003 + 1122) * 458;

      pixels[x + y * width] = color(h, s, b);
    }
  }

  updatePixels();
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    saveFrame("Day_012_##.png");
  }
  if (key == '1') drawType = 1;
  if (key == '2') drawType = 2;
}
