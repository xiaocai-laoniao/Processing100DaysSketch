PImage demoImg;
int resizeW;
int resizeH;

void setup() {
  size(600, 600);
  
  demoImg = loadImage("demo.jpg");
  
  resizeW = 300;
  resizeH = int(demoImg.height / demoImg.width * resizeW);
  demoImg.resize(resizeW, resizeH); 
}


void draw() {
  
  background(255);
  stroke(0);
  noFill();
  
  // 左上角图片
  imageMode(CORNER);
  image(demoImg, 0, 0);
  rect(0, 0, resizeW, resizeH);
  fill(0, 0, 255);
  circle(0, 0, 20);
  
  // 左下角图片
  pushMatrix();
  imageMode(CENTER);
  translate(resizeW * 0.5, resizeH + resizeH * 0.5);
  scale(1.00, -1.00);
  image(demoImg, 0, 0);
  popMatrix();
  
  noFill();
  rect(0, resizeH, resizeW, resizeH);
  fill(0, 0, 255);
  circle(resizeW * 0.5, resizeH + resizeH * 0.5, 20);
  
  
  // 右上角图片
  pushMatrix();
  imageMode(CENTER);
  translate(resizeW + resizeW * 0.5, resizeH * 0.5);
  scale(-1.00, 1.00);
  image(demoImg, 0, 0);
  popMatrix();
  
  noFill();
  rect(resizeW, 0, resizeW, resizeH);
  fill(0, 0, 255);
  circle(resizeW + resizeW * 0.5, resizeH * 0.5, 20);
  
  
  // 右下角图片
  pushMatrix();
  imageMode(CENTER);
  translate(resizeW + resizeW * 0.5, resizeH + resizeH * 0.5);
  scale(-1.00, -1.00);
  image(demoImg, 0, 0);
  popMatrix();
  
  noFill();
  rect(resizeW, resizeH, resizeW, resizeH);
  fill(0, 0, 255);
  circle(resizeW + resizeW * 0.5, resizeH + resizeH * 0.5, 20);
}


void keyPressed() {
  if (key == 's') {
    save("Day_045.png");
  }  
}