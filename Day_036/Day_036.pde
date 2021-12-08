import com.hamoid.*;

VideoExport videoExport;
boolean start = false;

void setup() {
  size(600, 600);
  background(0);

  videoExport = new VideoExport(this);
  videoExport.startMovie();
}

void draw() {
  // 如果没有开始 或者 鼠标没有按下来，则直接 return 不做后续绘画处理
  if (!start || !mousePressed) {
    return;
  }

  fill(random(255), random(255), random(255));
  noStroke();

  float deltaX = abs(mouseX - pmouseX);
  float deltaY = abs(mouseY - pmouseY);
  float r = max(deltaX, deltaY);

  circle(mouseX, mouseY, r);
  
  videoExport.saveFrame();
}

void keyPressed() {
  if (key == 'c') {
    background(0);
    videoExport.endMovie();
  }
  if (key == 'b') {
    start = !start;
  }
  if (key == 's') {
    save("Day_036.png");
  }
}
