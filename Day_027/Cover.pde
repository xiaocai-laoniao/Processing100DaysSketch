// 头像封面框，用于预览选择

class Cover {
  // 位置
  float x;
  float y;

  // PImage图像信息
  PImage coverImg;
  // 是否被选中
  Boolean isSelected = false;

  // 初始化构造函数
  Cover(float x, float y, PImage coverImg) {
    this.x = x;
    this.y = y;
    this.coverImg = coverImg;
    this.coverImg.resize(coverSize, coverSize);
  }
  
  // 鼠标是否在本身内部区域
  Boolean isIn() {
     return mouseX >= this.x && mouseX <= this.x + coverSize && mouseY >= this.y && mouseY <= this.y + coverSize;
  }

  // 绘制部分
  void display() {
    pushMatrix();
    
    // 选中的情况下，在图像后面画一个框
    if (this.isSelected) {
      stroke(255, 0, 0);
      strokeWeight(4);
      noFill();
      rect(this.x - 2, this.y - 2, coverSize + 4, coverSize + 4);
    }

    // 预览图显示
    image(coverImg, this.x, this.y);

    popMatrix();
  }
}
