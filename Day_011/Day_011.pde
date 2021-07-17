// Processing100DaysSketch 

int mirrorType = 1;

void setup() {
  size(1000, 800);
  background(255);

  stroke(0);
  strokeWeight(8);
}


void draw() {
  fill(255, 0, 0);
  PFont font = createFont("STSongti-SC-Regular", 20);
  textFont(font);
  text("1. 键盘1-中间竖线镜像\n2. 键盘2-中间横向镜像\n3. 键盘3-中间竖线和横线镜像", 20, 20, width, height);
  
  if (mirrorType == 1) {
    line(width / 2, 0, width / 2, height);

    if (mousePressed) { drawMirrorCenterX(); }
  } else if (mirrorType == 2) {
    line(0, height / 2, width, height / 2);

    if (mousePressed) { drawMirrorCenterY(); }
  } else if (mirrorType == 3) {
    line(width / 2, 0, width / 2, height);
    line(0, height / 2, width, height / 2);

    if (mousePressed) { drawMirrorCenterXY(); }
  }
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_011.png");
  }
  if (key == '1') {
    mirrorType = 1;
    background(255);
  } else if (key == '2') {
    mirrorType = 2;
    background(255);
  } else if (key == '3') {
    mirrorType = 3;
    background(255);
  }
}

void drawMirrorCenterX() {
  pushMatrix();

  line(mouseX, mouseY, pmouseX, pmouseY);
  line(width - mouseX, mouseY, width - pmouseX, pmouseY);
  popMatrix();
}

void drawMirrorCenterY() {
  pushMatrix();

  line(mouseX, mouseY, pmouseX, pmouseY);
  line(mouseX, height - mouseY, pmouseX, height - pmouseY);
  popMatrix();
}

void drawMirrorCenterXY() {
  pushMatrix();
  // draw 2 lines
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  line(mouseX, mouseY, pmouseX, pmouseY);
  line(width - mouseX, mouseY, width - pmouseX, pmouseY);
  line(mouseX, height - mouseY, pmouseX, height - pmouseY);
  line(width - mouseX, height - mouseY, width - pmouseX, height - pmouseY);
  popMatrix();
}
