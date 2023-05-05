float xmin = -1.5;
float xmax = 1.5;
float ymin = -1.5;
float ymax = 1.5;
float juliaX = 0.285;
float juliaY = 0.01;
float zoom = 1;
int maxIterations = 100;
float maxR = 2;
float smoothness = 50;
float angle = 0;
float angleSpeed = 0.01;

void setup() {
  size(600, 600);
  colorMode(HSB, 255);
  smooth();
  frameRate(30);
}

void draw() {
  background(0);
  loadPixels();
  for (int x = 0; x < width; x++) {
    for (int y = 0; y < height; y++) {
      float a = map(x, 0, width, xmin/zoom, xmax/zoom);
      float b = map(y, 0, height, ymin/zoom, ymax/zoom);
      float ca = a;
      float cb = b;
      float n = 0;
      while (n < maxIterations) {
        float aa = a * a - b * b;
        float bb = 2 * a * b;
        a = aa + juliaX;
        b = bb + juliaY;
        if (a*a + b*b > maxR * maxR) {
          break;
        }
        n++;
      }
      float colorValue = map(n, 0, maxIterations, 0, 255);
      if (n == maxIterations) {
        colorValue = 0;
      } else {
        colorValue = map(log(n + 1) / log(smoothness), 0, 1, 0, 255);
      }
      pixels[x + y * width] = color(colorValue, 255, 255);
    }
  }
  updatePixels();
  angle += angleSpeed;
  juliaX = cos(angle) * 0.3;
  juliaY = sin(angle) * 0.3;
  zoom *= 0.995;
  if (zoom < 1) {
    zoom = 1;
  }
}
