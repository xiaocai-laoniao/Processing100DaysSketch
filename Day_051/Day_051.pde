import com.hamoid.*;

VideoExport videoExport;
boolean recording = false;

boolean[][] occupied;
Particle[][] reference;
PVector mouse;
PVector pmouse;
PVector mouseV;
Particle[] field;

PVector wind = new PVector(0, 0);
PVector gravity = new PVector(0, 0.1);

PImage img;
String[] imageNames = {"logo.png", "spiderman.jpeg", "sand.jpeg", "sand2.jpeg"};
int currentImageIndex = 0;

void setup() {
  size(800, 800);

  videoExport = new VideoExport(this);
  reset();
}

void reset() {
  String imageName = imageNames[currentImageIndex];
  img = loadImage(imageName);
  int imgWidth = img.width;
  int imgHeight = img.height;

  occupied = new boolean[width][height];
  reference = new Particle[width][height];
  field = new Particle[imgWidth * imgHeight];
  for (int i = 0; i < field.length; i++) {
    int x_img = i % imgWidth;
    int y_img = i / imgWidth;
    int x = width / 2 - imgWidth / 2 + x_img;
    int y = height / 2 - imgHeight / 2 + y_img;
    field[i] = new Particle(x, y, img.get(x_img, y_img));
  }

  currentImageIndex = (currentImageIndex + 1) % imageNames.length;
}

void draw() {
  background(255);

  pmouse = new PVector(pmouseX, pmouseY);
  mouse = new PVector(mouseX, mouseY);
  mouseV = PVector.sub(mouse, pmouse);
  for (int i = 0; i < field.length; i++) {
    field[i].applyForce(wind);
    field[i].update();
    set(round(field[i].location.x), round(field[i].location.y), field[i].clr);
  }

  drawWind();

  if (recording) {
    videoExport.saveFrame();
  }
}

void drawWind() {
  if (wind.mag() == 0) {
    return;
  }
  pushMatrix();
  translate(width / 2, height / 2);
  rotate(wind.heading());
  stroke(255, 0, 0);
  strokeWeight(2);
  float len = 30;
  line(0, 0, len, 0);
  line(len, 0, len - 8, -8);
  line(len, 0, len - 8, 8);
  popMatrix();

  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  text("Wind (" + nf(wind.x, 0, 2) + ", " + nf(wind.y, 0, 2) + ")", width / 2, height / 2 + 20);
}

void keyPressed() {
  if (key == '1') {
    wind = PVector.random2D().mult(random(1));
    reset();
  }
  if (key == '2') {
    wind = PVector.random2D().mult(random(1));
  }  
  if (key == 'r' || key == 'R') {
    reset();
  }

  if (key == ' ') {
    recording = !recording;
    if (recording) {
      videoExport.startMovie();
    } else {
      videoExport.endMovie();
      exit();
    }
  }
}
