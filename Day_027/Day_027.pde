// 公众号、视频号、Bilibili：小菜与老鸟 //<>// //<>//
// 国庆头像生成器 by 小菜与老鸟

// 通过文件选择器选择的文件路径
String imageChoosedPath;
// 合法的图片文件后缀
String[] imageExtensions = {"png", "jpg", "jpeg"};

// 头像尺寸，这里默认和模版封面的尺寸一致
final int avatarSize = 320;
// 头像模版数量，目前有7张图，见data文件夹
final int headersCount = 7;
// 头像模版缩略图大小
final int coverSize = 100;
// 头像模版缩略图起始位置
final float coverStartX = 20;
final float coverStartY = 500;

// 头像图片
PImage avatarImage;
// 封面图片数组
PImage[] coverImages;
// 封面图预览数组
Cover[] covers;
int currentSelectedCoverIndex = 0;

// 头像图层，包含头像和头像的框图封面
PGraphics avatarLayer;

void setup() {
  size(800, 800);

  // 加载封面图数据
  loadCoverImages();
  // 加载封面预览图数据
  loadCovers();

  avatarLayer = createGraphics(avatarSize, avatarSize);
}

void draw() {
  background(200);

  // 头像图层的绘制部分
  avatarLayer.beginDraw();
  avatarLayer.pushMatrix();
  avatarLayer.background(200);
  if (avatarImage != null) {
    // 绘制头像
    avatarLayer.image(avatarImage, 0, 0);
  } else {
    // 如果没选图像，默认一个矩形填充
    avatarLayer.fill(100);
    avatarLayer.noStroke();
    avatarLayer.rect(0, 0, avatarSize, avatarSize);
  }
  // 获取当前选中的封面图数据
  PImage currentSelectedCoverImage = coverImages[currentSelectedCoverIndex];
  // 绘制头像封面
  avatarLayer.image(currentSelectedCoverImage, 0, 0);
  avatarLayer.popMatrix();
  avatarLayer.endDraw();

  // 将头像图层显示出来
  image(avatarLayer, 100, 100);

  pushMatrix();
  for (Cover cover : covers) {
    cover.display();
  }
  popMatrix();

  fill(0);
  textAlign(CENTER, TOP);
  text("国庆头像生成器", width / 2, 50);
  textAlign(LEFT, BOTTOM);
  text("1) 通过键盘c或者C字母键，打开文件选择器，选择一个头像文件，建议正方形尺寸\n2) 可以选择头像的模版\n3) 通过键盘s或者S字母键，进行头像的保存", width / 2 - 200, height - 100);
}

void keyPressed() {
  if (key == 'c' || key == 'C') {
    selectInput("选择头像文件(png/jpg/jpeg格式)", "fileSelected");
  } else if (key == 's' || key == 'S') {
    avatarLayer.save("NationalDayAvatar-" + frameCount + ".png");
    println("保存头像成功");
  }
}

void mousePressed() {
  // 检测鼠标按压区域，是否在某个模版预览区域
  for (int i = 0; i < covers.length; i++) {
    Cover cover = covers[i];
    if (cover.isIn()) {
      covers[currentSelectedCoverIndex].isSelected = false;

      currentSelectedCoverIndex = i;
      cover.isSelected = true;

      break;
    }
  }
}

void fileSelected(File selection) {
  if (selection == null) {
    println("[文件选择] 取消文件选择");
  } else {
    imageChoosedPath = selection.getAbsolutePath();
    println("[文件选择] 选择文件 " + imageChoosedPath);

    String[] paths = split(imageChoosedPath, "/");
    String fileName = paths[paths.length - 1];

    Boolean isValidImage = checkFileExtension(fileName);
    if (isValidImage) {
      avatarImage = loadImage(imageChoosedPath);
      avatarImage.resize(avatarSize, avatarSize);
    } else {
      println("[文件选择] 文件选择非 png/jpg/jpeg 格式");
    }
  }
}

// 检查选择的文件的后缀是否符合要求，只支持png/jpg/jpeg
Boolean checkFileExtension(String fileName) {
  Boolean isValidImage = false;
  for (String extension : imageExtensions) {
    if (fileName.endsWith(extension)) {
      isValidImage = true;
      break;
    }
  }
  return isValidImage;
}


void loadCoverImages() {
  coverImages = new PImage[headersCount];
  for (int i = 0; i < headersCount; i++) {
    coverImages[i] = loadImage("header" + (i + 1) + ".png");
  }
}

void loadCovers() {
  covers = new Cover[headersCount];
  for (int i = 0; i < headersCount; i++) {
    // 注意是封面图数据 copy 一份，然后封面预览图缩小，影响到原图的数据
    PImage coverImage = coverImages[i].copy();
    float x = coverStartX + (coverSize + 10) * i;
    float y = coverStartY;
    Cover cover = new Cover(x, y, coverImage);
    covers[i] = cover;

    // 默认选中第一个
    if (i == currentSelectedCoverIndex) {
      cover.isSelected = true;
    }
  }
}
