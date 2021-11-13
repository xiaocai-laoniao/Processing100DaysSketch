class Sprite {
  PImage spritesheet;
  JSONObject config;
  ArrayList<PImage> imageArr;
  int frame;
  float frameTotal;
  float animationSpeed;

  Sprite(PImage spritesheet, JSONObject config, float animationSpeed) {
    this.spritesheet = spritesheet;
    this.config = config;
    this.animationSpeed = animationSpeed;
    this.imageArr = new ArrayList();

    // 根据json配置将精灵图的子图通过 get(x, y, width, height) 保存到图片数组中
    JSONObject frames = this.config.getJSONObject("frames");
    Set framesSet = frames.keys();
    ArrayList<String> imageNameArr = new ArrayList(framesSet);
    imageNameArr.sort(Comparator.naturalOrder());
    for (int i = 0; i < imageNameArr.size(); i++) {
      String imageName = imageNameArr.get(i);
      JSONObject frameInfo = frames.getJSONObject(imageName).getJSONObject("frame");
      int imageX = int(frameInfo.getFloat("x"));
      int imageY = int(frameInfo.getFloat("y"));
      int imageWidth = int(frameInfo.getFloat("w"));
      int imageHeight = int(frameInfo.getFloat("h"));
      
      PImage img = this.spritesheet.get(imageX, imageY, imageWidth, imageHeight);
      this.imageArr.add(img);
    }
 
  }

  void display(float x, float y) {
    this.frameTotal += this.animationSpeed;
    
    this.frame = int(this.frameTotal % this.imageArr.size());
    image(this.imageArr.get(this.frame), x, y);
  }
}
