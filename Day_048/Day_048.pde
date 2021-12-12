// 公众号、视频号、Bilibili：小菜与老鸟

PImage logoImage;
ArrayList<NormalAgent> agents;

final int SPACE = 5;

PVector bulletPosition;

int elapsedFrames = 0;
import com.hamoid.*;

VideoExport videoExport;

void setup() {
  size(1280, 720);
  
  logoImage = loadImage("logo.jpg");
  logoImage.resize(width, height);

  bulletPosition = new PVector(0, height / 2);

  agents = new ArrayList<NormalAgent>();

  for (int x = 0; x < width; x += SPACE) {
    for (int y = 0; y < height; y += SPACE) {
      if (brightness(logoImage.get(x, y)) < 50) {
        NormalAgent agent = new NormalAgent(x, y);
        agents.add(agent);
      }
    }
  }
  
  frameRate(60);
  
  videoExport = new VideoExport(this);
  videoExport.startMovie();
}

void draw() {
  background(#623CEA);
  noStroke();

  for (NormalAgent agent: agents) {
    agent.flee(bulletPosition);
    agent.update();
    agent.display();
  }

  updateBullet();
  
  videoExport.saveFrame();
}

void updateBullet() {
  bulletPosition.x += 5;

  fill(#EF3054);
  circle(bulletPosition.x, bulletPosition.y, 30);
}

class NormalAgent {
  PVector originPosition;
  PVector currentPosition;
  PVector speed;
  PVector acceleration;

  NormalAgent(float x, float y) {
    currentPosition = new PVector(x, y);
    originPosition = currentPosition.copy();
    speed = new PVector(0, 0);
    acceleration = new PVector(0, 0);
  }

  void flee(PVector awayPosition) {
    float distance = PVector.dist(currentPosition, awayPosition);
    if (distance < 30) {
      acceleration = PVector.sub(currentPosition, awayPosition);
      acceleration.mult(0.4);
      speed.add(acceleration);
      currentPosition.add(speed);
    }
  }

  void update() {
    acceleration = PVector.sub(originPosition, currentPosition);
    acceleration.mult(0.01);
    speed.add(acceleration);
    currentPosition.add(speed);
    speed.mult(0.98);
  }

  void display() {
    if (abs(originPosition.x - currentPosition.x) < 0.1 && abs(originPosition.y - currentPosition.y) < 0.1) {
      fill(#B7ADCF);
    } else {
      fill(#9CFFFA);
    }
    circle(currentPosition.x, currentPosition.y, 4);
  }
}

void keyPressed() {
  if (key == 's') {
    save("Day_048.png");
  }
  if (key == 'e') {
    videoExport.endMovie();
    exit();
  }
}
