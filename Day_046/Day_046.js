let canvas_size = 600;
var number_of_rows = 10;
var number_of_columns = 10;

let cell_size = canvas_size / number_of_columns;

function setup() {
	createCanvas(canvas_size, canvas_size);
	stroke(200);
}

function draw() {
  background(255);
	for (var j = 0; j < number_of_rows; j += 1) {
		for (var i = 0; i < number_of_columns; i += 1) {
			fill(255);
			rect(i*cell_size, j*cell_size, cell_size, cell_size);
		}
	}

  // 为了方便演示寻找周边邻居的原理，我们计算出鼠标所在的格子位置，目标就是找出鼠标格子周围的格子
  // 注意:!!!
  // 邻居是可以 wrap 的？什么意思呢？就是可以环绕！
  var mx = floor(mouseX / cell_size);
  var my = floor(mouseY / cell_size);
  mx = constrain(mx, 0, number_of_columns - 1);
  my = constrain(my, 0, number_of_rows - 1);

  // 带上鼠标自己的格子，带上邻居，正常情况下是一个九宫格

  drawWithWrap(mx, my);
}

function drawWithWrap(mx, my) {

  for (y = -1; y <= 1; y +=1 ){
    for (x = -1; x <= 1; x +=1 ){
      var wrapped_i = (mx + x + number_of_rows) % number_of_rows;
      var wrapped_j = (my + y + number_of_columns) % number_of_columns;


      if (x == 0 && y == 0) {
        fill(255, 0, 0);
        rect(mx * cell_size, my * cell_size, cell_size, cell_size);
      } else {
        fill(0);
        rect(wrapped_i * cell_size, wrapped_j * cell_size, cell_size, cell_size);
      }
      let pos = "(" + wrapped_i + ", " + wrapped_j + ")"
      fill(0, 255, 255);
      textAlign(TOP, TOP);
      textSize(20);
      text(pos, wrapped_i * cell_size, wrapped_j * cell_size);
    }
  }
}