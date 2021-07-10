class Platform {

  Body body;
  float w;
  float h;

  Platform(float x_, float y_) {
    float x = x_;
    float y = y_;
    w = 200;
    h = 30;
    makeBody(new Vec2(x, y), w, h);
  }

  void killBody() {
    box2d.destroyBody(body);
  }

  boolean contains(float x, float y) {
    Vec2 worldPoint = box2d.coordPixelsToWorld(x, y);
    Fixture f = body.getFixtureList();
    boolean inside = f.testPoint(worldPoint);
    return inside;
  }

  void display(float targetX, float targetY, color c) {
    body.setTransform(box2d.coordPixelsToWorld(targetX, targetY), 0);
    Vec2 pos = box2d.getBodyPixelCoord(body);

    rectMode(PConstants.CENTER);
    pushMatrix();
    translate(pos.x, pos.y);
    fill(c);
    stroke(0);
    rect(0, 0, w, h);
    popMatrix();
  }


  void makeBody(Vec2 center, float w_, float h_) {
    BodyDef bd = new BodyDef();
    bd.type = BodyType.STATIC;
    bd.position.set(box2d.coordPixelsToWorld(center));
    body = box2d.createBody(bd);

    PolygonShape sd = new PolygonShape();
    float box2dW = box2d.scalarPixelsToWorld(w_/2);
    float box2dH = box2d.scalarPixelsToWorld(h_/2);
    sd.setAsBox(box2dW, box2dH);

    FixtureDef fd = new FixtureDef();
    fd.shape = sd;
    fd.density = 1;
    fd.friction = 0.3;
    fd.restitution = 0.5;

    body.createFixture(fd);
  }
}
