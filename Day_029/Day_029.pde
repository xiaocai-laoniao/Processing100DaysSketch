Scene1 scene1;
Scene2 scene2;
Scene3 scene3;
Scene4 scene4;

boolean fadeOut = true;
float alpha = 0;
boolean switchScene = false;
ArrayList<Scene> scenes;
int currentSceneIndex;
void setup() {
  size(800, 800);
  noStroke();

  scenes = new ArrayList();

  scene1 = new Scene1();
  scene2 = new Scene2();
  scene3 = new Scene3();
  scene4 = new Scene4();
  scenes.add(scene1);
  scenes.add(scene2);
  scenes.add(scene3);
  scenes.add(scene4);
  currentSceneIndex = 0;
  scenes.get(currentSceneIndex).playing = true;
}

void draw() {
  for (Scene scene : scenes) {
    if (scene.playing) {
      scene.display();
    }
  }
  if (switchScene) {
    // 开始渐隐
    if (fadeOut) {
      alpha += 3;

      fill(0, alpha);
      rect(0, 0, width, height);


      if (alpha >= 255) {
        alpha = 255;

        // 停止当前场景的绘制
        scenes.get(currentSceneIndex).playing = false;
        // 开始下一个场景的绘制
        int nextIndex= (currentSceneIndex + 1) % (scenes.size());
        scenes.get(nextIndex).playing = true;

        // 当前场景的索引进行更新
        currentSceneIndex = nextIndex;

        fadeOut = false;
      }
    } else { // 渐渐显示
      alpha -= 3;

      if (alpha >= 0) {

        fill(0, alpha);
        rect(0, 0, width, height);
      } else {

        alpha = 0;
        // 场景切换动作结束
        switchScene = false;
        fadeOut = true;
      }
    }
  }
}


// 键盘事件触发
// 或者程序运行时间 millis() 触发
// 或者某个变量达到某个临界值
void keyPressed() {
  if (key == 's') {
    // 开始场景切换，一次场景切换包含渐隐(fadeOut = true)、渐现(fadeOut = false)两步
    switchScene = true;
    fadeOut = true;
  }

  if (key == '0') {
    save("Day_029.png");
  }
}

class Scene {
  public boolean playing = false;

  public void display() {
  }
}


class Scene1 extends Scene {

  void display() {
    pushMatrix();
    background(255, 0, 255);
    fill(255);
    text("scene1", width / 2, height / 2);
    popMatrix();
  }
}


class Scene2 extends Scene {

  void display() {
    pushMatrix();
    background(0, 0, 255);
    fill(255);
    text("scene2", width / 2, height / 2);
    popMatrix();
  }
}

class Scene3 extends Scene {

  void display() {
    pushMatrix();
    background(0, 255, 255);
    fill(255);
    text("scene3", width / 2, height / 2);
    popMatrix();
  }
}

class Scene4 extends Scene {

  void display() {
    pushMatrix();
    background(10, 0, 255);
    fill(255);
    text("scene4", width / 2, height / 2);
    popMatrix();
  }
}
