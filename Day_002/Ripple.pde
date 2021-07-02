class Ripple {
  PVector location;
  float startRadius;
  float endRadius;
  float spreadSpeed;
  int number;
  float[] radiusList;

  Ripple(PVector location, float startRadius, float endRadius, int number, float spreadSpeed) {
    this.location = location;
    this.startRadius = startRadius;
    this.endRadius = endRadius;
    this.number = number;
    this.spreadSpeed = spreadSpeed;

    this.radiusList = new float[number];
    for (int i = 0; i < number; i++) {
      float radius = startRadius + i * 40;
      radiusList[i] = radius;
    }
  }

  void update() {
    for (int i = 0; i < number; i++) {
      radiusList[i] = radiusList[i] + spreadSpeed;
      if (radiusList[i] >= endRadius) {
        radiusList[i] = - 20; // 增加间隔
      }
    }
  }

  void display() {
    noFill();
    strokeWeight(2);
    for (int i = number - 1; i >= 0; i--) {
      float alpha = map(radiusList[i], startRadius, endRadius, 120.0, 0.0);
      stroke(40, 40, 40, alpha);
      if (radiusList[i] >= 0) {
        circle(location.x, location.y, radiusList[i]);
      }
    }
  }
}
