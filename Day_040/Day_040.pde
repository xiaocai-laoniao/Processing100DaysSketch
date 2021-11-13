import gifAnimation.*;

PImage[] animation;
Gif loopingGif;
Gif nonLoopingGif;

boolean pause = false;

public void setup() {
  size(800, 300);
  frameRate(60);
  
  println("gifAnimation " + Gif.version());
  
  // 一个循环播放的gif动画
  loopingGif = new Gif(this, "demo.gif");
  loopingGif.loop();
  
  // 一个不循环播放的gif动画，只播放一次，通过ignoreRepeat控制
  nonLoopingGif = new Gif(this, "demo.gif");
  nonLoopingGif.play();
  nonLoopingGif.ignoreRepeat();
  
  // 获取到gif中的所有图片，保存到PImage[]数组中
  animation = Gif.getPImages(this, "demo.gif");
}

void draw() {
  background(255);
  
  // 绘制循环gif
  image(loopingGif, 10, height / 2 - loopingGif.height / 2);
  // 绘制不循环gif，mousePressed函数中点击鼠标可以再次播放一次
  image(nonLoopingGif, width/2 - nonLoopingGif.width/2, height / 2 - nonLoopingGif.height / 2);
  
  // 这个例子中使用鼠标的x位置来map映射到gif内部图片数组的播放进度
  int animationIndex = (int)(map(mouseX, 0, width, 0, animation.length - 1));
  float gifWidth = animation[0].width;
  float gifHeight = animation[0].height;
  image(animation[animationIndex], width - 10 - gifWidth, height / 2 - gifHeight / 2);
}

void mousePressed() {
  nonLoopingGif.play();
}

void keyPressed() {
  // 敲击空格键
  if (key == ' ') {
    // 如果动画已经暂停，则播放，否则暂停
    if (pause) {
      nonLoopingGif.play();
      loopingGif.play();
      pause = false;
    } 
    else {
      nonLoopingGif.pause();
      loopingGif.pause();
      pause = true;
    }
  }
}
