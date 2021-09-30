final int PARTICLE_SIZE = 50;
final int PARTICLE_SPACE = 20;

enum Mode {
  P_4_CLOCKWISE,
  P_4_ANTICLOCKWISE
}

Mode mode = Mode.P_4_CLOCKWISE;
Particle[] particles = new Particle[4];
void setup() {
  size(800, 800);
  rectMode(CENTER);

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      int index = j * 2 + i;
      particles[index] = new Particle(i, j);
    }
  }
}

void update() {
  if (mode == Mode.P_4_CLOCKWISE) {
    for (int i = 0; i < 2; i++) {
      for (int j = 0; j < 2; j++) {
        int index = j * 2 + i;
        Particle p = particles[index];
        int nextIndex = index;
        if (i == 0 && j == 0) {
          nextIndex = (j + 1) * 2 + i;
        } else if (i == 0 && j == 1) {
          nextIndex = j * 2 + (i + 1);
        } else if (i == 1 && j == 1) {
          nextIndex = (j - 1) * 2 + i;
        } else {
          nextIndex = j * 2 + (i - 1);
        }
        p.targetX = particles[nextIndex].x;
        p.targetY = particles[nextIndex].y;
      }
    }
  }
}

void draw() {
  background(255);

  if (frameCount % 200 == 0) {
    update();
  }
  if (mode == Mode.P_4_CLOCKWISE) {
    for (Particle p : particles) {
      p.display();
    }
  }
}

PVector convertXY2World(int x, int y) {
  float locX = (PARTICLE_SIZE + PARTICLE_SPACE) * x + PARTICLE_SIZE * 0.5;
  float locY = (PARTICLE_SIZE + PARTICLE_SPACE) * y + PARTICLE_SIZE * 0.5;
  PVector loc = new PVector(locX, locY);
  return loc.add(new PVector(100, 100));
}

class Particle {
  int x;
  int y;
  int targetX;
  int targetY;

  float amtX = 0;
  float amtY = 0;

  Particle(int x, int y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  void display() {
    PVector worldLoc = convertXY2World(this.x, this.y);
    PVector targetWorldLoc = convertXY2World(this.targetX, this.targetY);
    float x = lerp(worldLoc.x, targetWorldLoc.x, amtX);
    float y = lerp(worldLoc.y, targetWorldLoc.y, amtY);

    noStroke();
    fill(0);
    rect(x, y, PARTICLE_SIZE, PARTICLE_SIZE);

    amtX += 0.1;
    amtY += 0.1;

    if (amtX >= 1) {
      amtX = 0;
      this.x = this.targetX;
    }
    if (amtY >= 1) {
      amtY = 0;
      this.y = this.targetY;
    }
  }
}