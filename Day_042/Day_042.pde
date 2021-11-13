import java.util.*;

PImage spritesheet;
// JSONObject https://processing.org/reference/loadJSONObject_.html
JSONObject spritesheetConfig;

Sprite demoSprite;

float posX;

void setup() {
  size(400, 200);
  
  // 加载精灵图
  spritesheet = loadImage("spritesheet.png");
  // 加载精灵图配置文件，因为配置是json格式，通过 loadJSONObject 保存到 JSONObject 中
  spritesheetConfig = loadJSONObject("spritesheet.json");
  
  // 精灵图初始化，传入精灵图和配置以及播放速度
  demoSprite = new Sprite(spritesheet, spritesheetConfig, 0.2); 
}

void draw() {
  background(255);
  
  posX = (posX + 1) % width;
  // 精灵图在特定位置播放
  demoSprite.display(posX, 0);
}
