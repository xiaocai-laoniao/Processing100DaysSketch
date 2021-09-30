PFont font;
int gridSize = 20;
PImage image;
String dataFileName = "grayPixels.txt";
String[] grayPixelsList = new String[10000]; // 100 * 100

Boolean generateDataMode = true;

void settings() {
  if (generateDataMode) {
    size(100, 100);
  } else {
    size(2000, 2000);
  }
}

void setup() {
  if (generateDataMode) {
    font = createFont("STHeiti", 100);
  } else {
    grayPixelsList = loadStrings(dataFileName);
  }
}

void draw() {
  background(255);
  if (generateDataMode) {
    println("generate start");
    generateGrayPixelsData();
    println("generate end");
  } else {
    showGrayPixels();
  }

  noLoop();
}

void showGrayPixels() {
  for (int i = 0; i < width / gridSize; i += 1) {
    for (int j = 0; j < height / gridSize; j += 1) {
      int index = j * width / gridSize + i;
      String grayStr = grayPixelsList[index];
      float grayValue = Float.parseFloat(grayStr);
      fill(grayValue);
      noStroke();
      rect(gridSize * i, gridSize * j, gridSize, gridSize);
      fill(255);
      textSize(8);
      textAlign(LEFT, TOP);
      text(grayStr, gridSize * i, gridSize * j);
    }
  }

  stroke(255);
  for (int i = 0; i < width; i++) {
    line(gridSize * i, 0, gridSize * i, height);
  }

  for (int j = 0; j < height; j++) {
    line(0, gridSize * j, width, gridSize * j);
  }
}

void generateGrayPixelsData() {
  textFont(font);
  fill(0);
  textAlign(CENTER, CENTER);
  text("2", width / 2, height / 2);

  loadPixels();
  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      int index = j * width + i;
      color c = pixels[index];
      float red = red(c);
      if (red < 5) {
        red = 0;
      } else {
        red = 255;
      }
      grayPixelsList[index] = String.valueOf(red);
    }
  }

  updatePixels();
}

void mousePressed() {
  if (key == 's') {
    if (generateDataMode) {
      println("保存图片中...");
      save("Day_024.png");
      println("保存图片成功.");
      println("保存图片数据中...");
      saveStrings(dataFileName, grayPixelsList);
      println("保存图片数据成功.");
    } else {
      println("保存图片中...");
      save("Day_024_2.png");
      println("保存图片成功.");
    }
  }
}
