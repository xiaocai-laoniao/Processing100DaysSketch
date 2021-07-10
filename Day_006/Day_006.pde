import processing.video.*;

int rows;
int cols;
float squareSize = 10.0;
Capture video;

void setup() {
  size(480, 480);
  rows = floor(width / squareSize);
  cols = floor(height / squareSize);
  
  video = new Capture(this, cols, rows, 30);
  video.start();
}

void draw() {
  if (video.available()) {
    video.read();
  }

  video.loadPixels();
  for (int i = 0; i < cols; i++) {
    for (int j = 0; j < rows; j++) {
      int x = floor(i * squareSize);
      int y = floor(j * squareSize);
      color c = video.pixels[i + j * video.width];
      fill(c);
      stroke(255);
      rect(x, y, squareSize, squareSize);
    }
  }
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_006.png");
  }
}
