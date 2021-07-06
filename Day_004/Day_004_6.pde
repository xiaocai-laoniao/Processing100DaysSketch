class Demo6 {
  void setup() {
    background(55);

    PShape ps = createShape(LINE, 50, 0, width-50, 0);
    color scol = color(220, 180, 20);
    float swmin = .5, swmax = 120.5, swinc = 6.0;

    int iters = (int) ((swmax - swmin) / swinc);
    int cnt = iters;

    for (float swcur=swmin; swcur<=swmax; swcur+=swinc) {
      color new_scol = colorHSV(scol, cnt--, iters, 2.5);
      ps.setStrokeWeight(swcur);
      ps.setStroke(new_scol);
      shape(ps, 0, height/2);
    }
  }

  color colorHSV(color col, int cur, int tot, float ramp) {
    colorMode(HSB, 360, 100, 100, 100);

    float curHue = hue(col);
    float curSat = saturation(col);
    float curVal = brightness(col);
    float curAlpha = alpha(col);

    curSat = lerp(curSat, 10, pow(cur/float(tot), ramp));
    curVal = lerp(curVal, 100, cur/float(tot));
    curAlpha = lerp(1, 25, pow(cur/float(tot), ramp));

    color c = color(curHue, curSat, curVal, curAlpha); 

    colorMode(RGB, 255, 255, 255, 255); // restore the colorMode
    return c;
  }

  void draw() {
  }
}
