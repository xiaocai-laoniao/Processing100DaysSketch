class Demo4 {
  PGraphics pg;

  void setup() {
    pg = createGraphics(width, height);
    paint();
  }

  void paint() {
    int colorAmount = 1 + int(random(3));
    float baseHue = random(255);

    background(0);

    pg.beginDraw();
    pg.background(0);
    pg.noStroke();
    pg.rectMode(CENTER);
    pg.colorMode(HSB);
    for (int i=0; i<100; i++) {
      float hu = (baseHue + (i%colorAmount) * (255/colorAmount)) % 255;  
      float s = random(200);
      float x = random(1);
      float y = random(1);
      pg.fill(hu, random(255), random(255));
      pg.pushMatrix();
      pg.translate(x*width, y*height);
      pg.rotate(TWO_PI * noise(x, y));
      pg.rect(0, 0, s, s);
      pg.popMatrix();
    }
    pg.endDraw();

    image(pg, 0, 0);

    pg.beginDraw();
    pg.filter(BLUR, 6);
    pg.endDraw();

    blend(pg, 0, 0, width, height, 6, 6, width, height, ADD);
  }

  void draw() {
  }
}