class Animation {
  PImage[] images;
  int imageCount;
  int frame;
  float frameSum = 0;
  float speed = 3;
  
  Animation(String imagePrefix, int count) {
    imageCount = count;
    images = new PImage[imageCount];

    // 根据图片数量，遍历加载图片，保存到PImage「」数组中
    for (int i = 0; i < imageCount; i++) {
      // Use nf() to number format 'i' into four digits
      String filename = imagePrefix + nf(i, 4) + ".png";
      images[i] = loadImage(filename);
    }
  }

  // frame每帧加speed，通过对 imageCount 取余来实现循环
  void display(float xpos, float ypos) {
    frameSum += speed;
    frame = int((frameSum + speed) % imageCount);
    image(images[frame], xpos, ypos);
  }
  
  int getWidth() {
    return images[0].width;
  }
}
