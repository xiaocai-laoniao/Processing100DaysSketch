// 公众号、视频号、Bilibili：小菜与老鸟 

import controlP5.*;
import processing.sound.*;


// 声音
AudioIn audioInput;
Amplitude rms;
BeatDetector beatDetector;
float volume;
float rotation = 0;


PGraphics contentLayer;
// controlp5 参数控制部分
ControlP5 cp5;
float rotation_speed = 0;
float xOffSet = 50;
float yOffSet = 50;
float xStep = 15;
float yStep = 15;
float xScale = 0.005;
float yScale = 0.005;
float ellipseD = 10;

void setup() {
  size(1000, 800);
  
  audioInput = new AudioIn(this);
  audioInput.start();

  beatDetector = new BeatDetector(this);
  beatDetector.input(audioInput);
  beatDetector.sensitivity(140);

  rms = new Amplitude(this);
  rms.input(audioInput);
  
  contentLayer = createGraphics(width, height);
  cp5 = new ControlP5(this);

  Group g = cp5.addGroup("group")
               .setPosition(50, 50)
               .setWidth(300)
               .activateEvent(true)
               .setBackgroundColor(color(255, 80))
               .setBackgroundHeight(300)
               .setLabel("Noise Control");

  cp5.addSlider("rotation_speed")
     .setPosition(10, 10)
     .setSize(180, 9)
     .setRange(0, 100)
     .setValue(0)
     .setGroup(g);

  cp5.addSlider("xOffSet")
     .setPosition(10, 30)
     .setSize(180, 9)
     .setRange(100, 600)
     .setValue(100)
     .setGroup(g);

  cp5.addSlider("yOffSet")
     .setPosition(10, 50)
     .setSize(180, 9)
     .setRange(100, 600)
     .setValue(100)
     .setGroup(g);

  cp5.addSlider("xStep")
     .setPosition(10, 70)
     .setSize(180, 9)
     .setRange(10, 30)
     .setValue(10)
     .setGroup(g);

  cp5.addSlider("yStep")
     .setPosition(10, 90)
     .setSize(180, 9)
     .setRange(10, 30)
     .setValue(10)
     .setGroup(g);

  cp5.addSlider("xScale")
     .setPosition(10, 110)
     .setSize(180, 9)
     .setRange(1, 10)
     .setValue(5)
     .setGroup(g);

  cp5.addSlider("yScale")
     .setPosition(10, 130)
     .setSize(180, 9)
     .setRange(1, 10)
     .setValue(5)
     .setGroup(g);

  cp5.addSlider("ellipseD")
     .setPosition(10, 150)
     .setSize(180, 9)
     .setRange(5, 20)
     .setValue(5)
     .setGroup(g);
}

void draw() {
  // ControlP5控制
  // drawContentByControlP5();
  
  // ControlP5 + Audio 控制
  drawContentControlledByAudio();
  image(contentLayer, 0, 0);
}

void controlEvent(ControlEvent theEvent) {
  if (theEvent.isController()){
    String name = theEvent.getController().getName();
    if (name == "rotation_speed") {
      rotation_speed = theEvent.getController().getValue();
    } else if (name == "xOffSet") {
      xOffSet = theEvent.getController().getValue();
    } else if (name == "yOffSet") {
      yOffSet = theEvent.getController().getValue();
    } else if (name == "xStep") {
      xStep = theEvent.getController().getValue();
    } else if (name == "yStep") {
      yStep = theEvent.getController().getValue();
    } else if (name == "xScale") {
      xScale = theEvent.getController().getValue();
    } else if (name == "yScale") {
      yScale = theEvent.getController().getValue();
    } else if (name == "ellipseD") {
      ellipseD = theEvent.getController().getValue();
    }
  }
}
 
void drawContentByControlP5() {
  contentLayer.beginDraw();
  contentLayer.background(#171717);
  contentLayer.noStroke();
  contentLayer.fill(#EDEDED); 
  contentLayer.translate(width/2, height/2);  
  contentLayer.rotate(frameCount * rotation_speed / 1000);

  for(float x = -xOffSet; x <= xOffSet; x += xStep){
    for(float y = -yOffSet; y <= yOffSet; y += yStep){
      float noiseX = x * xScale / 1000 + 300 + frameCount * 0.01;
      float noiseY = y * yScale / 1000 + 0 + frameCount * 0.01;
      float nf = noise(noiseX,noiseY);
      contentLayer.ellipse(x * nf, y * nf, ellipseD * nf, ellipseD * nf);      
    }
  }

  contentLayer.endDraw();
}

void drawContentControlledByAudio() {
  volume = rms.analyze();

  contentLayer.beginDraw();
  contentLayer.colorMode(HSB);
  contentLayer.background(0);
  contentLayer.noStroke();
  
  float h = volume * 1000;
  float s = volume * 1000;
  contentLayer.fill(h, s, 255); 
  contentLayer.translate(width/2, height/2);  

  rotation += volume * 0.65;
  contentLayer.rotate(rotation);

  float tmpXOffSet = xOffSet + volume * 708;
  float tmpYOffSet = yOffSet + volume * 708;
  float tmpXStep = xStep + volume * 100;
  float tmpYStep = yStep + volume * 100;
  float tmpEllipseD = ellipseD * volume * 15;
  tmpEllipseD = min(10, tmpEllipseD);

  for(float x = -tmpXOffSet; x <= tmpXOffSet; x += tmpXStep){
    for(float y = -tmpYOffSet; y <= tmpYOffSet; y += tmpYStep){
      float noiseX = x * xScale / 1000 + 300 + frameCount * 0.01;
      float noiseY = y * xScale / 1000 + 0 + frameCount * 0.01;
      float nf = noise(noiseX,noiseY);
      contentLayer.ellipse(x * nf, y * nf, tmpEllipseD * nf, tmpEllipseD * nf);      
    }
  }

  contentLayer.endDraw();
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_013.png");
  }
}
