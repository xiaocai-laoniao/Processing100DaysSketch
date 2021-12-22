import java.util.*;

void setup() {
  size(200, 200);

  // 指定文件夹路径 - 绝对路径
  File dataFolder = new File("/Users/childhoodandy/Documents/github/xiaocai-laoniao/processing/Processing100DaysSketch/Day_050/data/");
  File[] listOfFiles = dataFolder.listFiles();

  // 按照文件修改时间排序 - 倒序 也就是最近修改排在前面
  Arrays.sort(listOfFiles, Comparator.comparingLong(File::lastModified).reversed());
  
  // 这里打印下文件名称，可以根据自己的需要，对排完序的文件进行处理
  for (File file : listOfFiles) {
    if (file.isFile()) {
      println(file.getName());
    }
  }
}

void draw() {
  background(0);
}
