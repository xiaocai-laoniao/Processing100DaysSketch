import java.nio.file.*;

//定义全局变量watchService
WatchService watchService;

//圆心x坐标
int x = 200;

//圆心y坐标
int y = 300;
//半径
int radius = 300;



void setup() {
  size(600, 600);

  registerFileWatch();//注册文件监听

  readData();   //读取初始数据
}

void draw() {
  background(#85B79D);

  ellipseMode(CENTER);
  fill(#8B728E);
  stroke(#694873);
  strokeWeight(3);
  ellipse(x, y, radius, radius);

  fill(0);
  textSize(18);
  textAlign(CENTER);
  text(x + ", " + y, x, y);
}

void registerFileWatch() {
  // 获取文件系统和WatchService
  FileSystem fs = FileSystems.getDefault();
  try {
    watchService = fs.newWatchService();
    //注册监听data文件夹
    Path path = Paths.get(sketchPath() + "/data/");
    path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
  }
  catch (IOException e) {
    e.printStackTrace();  //打印异常详细信息
  }
  Thread thread = new Thread(new Runnable() {
    public void run() {
      watch();  //调用watch方法
    }
  }
  );
  thread.start();
}


void readData() {
  // 读取文件最新数据
  String[] lines = loadStrings("data.txt");
  x = Integer.parseInt(lines[0]);
  y = Integer.parseInt(lines[1]);
  radius = Integer.parseInt(lines[2]);
}


// 文件变更
void fileChanged(WatchEvent<?> event) {
  // 获取事件中的文件名
  WatchEvent<Path> ev = (WatchEvent<Path>)event;
  Path filename = ev.context();

  // 根据文件名判断是否为data.txt文件
  if (filename.toString().equals("data.txt")) {

    println("data.txt 文件发生变化");
    // 读取data.txt文件最新数据
    readData();

    println("x: " + x + ", y: " + y);
  }
}


void watch() {
  while (true) {
    WatchKey key;
    try {
      key = watchService.take();  // 阻塞获取监听事件
    }
    catch (InterruptedException e) {
      return;
    }

    for (WatchEvent<?> event : key.pollEvents()) {
      // 检查事件类型是否为"ENTRY_MODIFY"
      if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
        fileChanged(event);  //  calling 响应方法
      }
    }

    key.reset(); // Reset 拾取消息,以获取新的事件
  }
}


void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_063.png");
  }
}
