Animation animation;

void setup() {
  size(640, 360);
  
  frameRate(24);
  imageMode(CENTER);
  
  animation = new Animation("frame-", 12);
}

void draw() {
  background(255);
  
  animation.display(width / 2, height / 2);
}
