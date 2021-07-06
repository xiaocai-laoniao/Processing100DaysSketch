Demo1 demo1;
Demo2 demo2;
Demo3 demo3;
Demo4 demo4;
Demo5 demo5;
Demo6 demo6;
void setup() {
  size(500, 500);
  //{ 
  //  demo1 = new Demo1(); 
  //  demo1.setup();
  //}
  { 
    demo2 = new Demo2(); 
    demo2.setup();
  }
  // { demo3 = new Demo3(); demo3.setup(); }
  //{ 
  //  demo4 = new Demo4(); 
  //  demo4.setup();
  //}
  // { demo5 = new Demo5(); demo5.setup(); }
  // { demo6 = new Demo6(); demo6.setup(); }
}

void draw() {
  //demo1.draw();
   demo2.draw();
  // demo3.draw();
  //demo4.draw();
  // demo5.draw();
  // demo6.draw();
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    save("Day_004.png");
  }
}
