class Demo2 {
  PGraphics pg;

  void setup() {
    fill(0, 0, 255);
    noStroke();
    smooth();
    pg = createGraphics(width, height);
    pg.beginDraw();
    pg.translate(width/2, height/2);
    pg.smooth();
    pg.background(255, 0);
    pg.noStroke();
    pg.fill(255, 0, 0);
    pg.ellipse(0, 0, 300, 300);
    pg.filter( BLUR, 6 );
    pg.fill(255, 255, 0);
    pg.ellipse(0, 0, 290, 290);
    pg.endDraw();
  }

  void draw() {
    background(255);
    ellipse(mouseX, mouseY, 320, 320);
    image(pg, 0, 0);
  }
}
