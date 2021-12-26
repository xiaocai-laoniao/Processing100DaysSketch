class Particle {
  PVector location;
  PVector velocity;
  PVector acceleration;
  int impatience = 0;
  color clr;
  float mass = 1.0;
  Particle(int x, int y, color clr) {
    location = new PVector(x, y);
    velocity = new PVector();
    acceleration = new PVector(0, 0);

    this.clr = clr;
    occupied[x][y] = true;
    reference[x][y] = this;
  }


  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }

  void update() {
    int px = round(location.x);
    int py = round(location.y);

    PVector newLoc = PVector.add(location, velocity);
    
    int nx = round(newLoc.x);
    int ny = round(newLoc.y);
    if (px != nx || py != ny) {
      if (nx < 0 || nx >= width) {
        velocity.x *= -0.5;
      } else if (ny < 0 || ny >= height) {
        velocity.y *= -0.5;
      } else {
        if (occupied[nx][ny]) {
          velocity.add(acceleration);

          PVector delta = PVector.sub(reference[nx][ny].velocity, velocity);
          delta.mult(0.9);
          float heat = impatience / 3f;
          delta.add(new PVector(random(-heat, heat), random(-heat, heat)));
          velocity.add(delta);

          reference[nx][ny].velocity.sub(delta);

          impatience++;
          if (impatience > 4) {
            impatience = 4;
          }
        } else {
          occupied[px][py] = false;
          occupied[nx][ny] = true;
          reference[nx][ny] = this;
          location = newLoc;
          impatience = 0;
        }
      }
    }
    if (mousePressed) {
      PVector arm = PVector.sub(mouse, location);
      float rad = 64;
      if (arm.mag() < rad) {
        PVector delta = PVector.sub(mouseV, velocity);
        delta.mult((1 - arm.mag() / rad) * 0.5);
        velocity.add(delta);
      }
    }

    velocity.add(gravity);
    acceleration.mult(0);
  }
}
