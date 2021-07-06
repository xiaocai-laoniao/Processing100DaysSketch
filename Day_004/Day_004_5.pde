class Demo5 {
  void setup() {
  }


  void draw() {
    background(0);

    glow3(new PVector(width / 2, height / 2), 10, 10, color(255, 0, 0));
  }

  // updating the pixels from the center source to the circle edges
  //
  // Pros
  // Circle boundary
  // Stable Pixels Update
  //
  // Cons
  // Step-like bright radials
  // Rough spreads

  void glow1(PVector gPos, float gSize, float spread, color spreadColor) {
    loadPixels();
    float distance = gSize;
    float rot = 0;
    while (rot < TWO_PI) { // spin the starting pixel draw by full rotation (360 degree = Two Pi)
      for (int len = 0; len < distance; len++) { //update pixels from center toward the current angle*boundary radius
        int x = floor(cos(rot) * len + gPos.x);
        int y = floor(sin(rot) * len + gPos.y);
        int index = x + y * width;
        float dx = gPos.x - x;
        float dy = gPos.y - y;
        float d = sqrt(sq(dx) + sq(dy));
        float col = spread / d;

        // drawing at the edges of the window? here is the solution
        if (index < height * width && index > 0)
          // update pixel
          pixels[index] = lerpColor(pixels[index], spreadColor, sq(col));
      }
      // next starting angle
      rot += 0.01;
    }
    updatePixels();
  }


  // updating the pixels from circle edges to another circle edges
  //
  // Pros
  // Circle boundary
  // Smooth Spread
  //
  // Cons
  // Unstable Spread
  // Changing distance leads to spread interference
  // minor spread error 

  void glow2(PVector gPos, float gSize, float spread, color spreadColor) {
    loadPixels();
    float k = 0;
    float distance = 100; // = gSize
    while (k < HALF_PI) { //
      int yPlus = floor(sin(TWO_PI - k) * distance + gPos.y); // for top part glows
      int yMinus = floor(sin(PI - (k + 0.01)) * distance + gPos.y); // for bottom part glows
      float aStart = PI + k; // starting angle
      float aEnd = TWO_PI - k; // ending angle
      int xStart = round(cos(aStart) * distance + gPos.x); // starting point.x 
      int xEnd  = round(cos(aEnd) * distance + gPos.x); // ending point x
      for (int i = xStart; i < xEnd; i++) { 
        float dx = gPos.x - i;
        float dy = gPos.y - yPlus;
        float d = sqrt(sq(dx) + sq(dy));
        float col = 1 / d * spread;

        //draw the top part
        int index = i + yMinus * width;
        if (index < height * width && index > 0)
          pixels[index] = lerpColor(pixels[index], spreadColor, sq(col));

        //draw the bottom part
        index = i + yPlus * width;
        if (index < height * width && index > 0)
          pixels[index] = lerpColor(pixels[index], spreadColor, sq(col));
      }
      k += 0.01;
    }
    updatePixels();
  }


  // updating pixels in given Rectangle boundary
  //
  // Pros
  // Stable Spread
  // Smooth Spread
  //
  // Cons
  // Rectangle boundary leads to bounded-like spread if boundary not quite big

  void glow3(PVector gPos, float gSize, float spread, color spreadColor) {
    loadPixels();
    for (int x = int(gPos.x - gSize); x < int(gPos.x + gSize); x++) {
      for (int y = int(gPos.y - gSize); y < int(gPos.y + gSize); y++) { 
        int index = x + y * width;
        float dx = gPos.x - x;
        float dy = gPos.y - y;
        float d = sqrt(sq(dx) + sq(dy));
        float col = 1 / d * spread;
        if (index < height * width && index > 0)
          pixels[index] = lerpColor(pixels[index], spreadColor, sq(col));
      }
    }
    updatePixels();
  }
}
