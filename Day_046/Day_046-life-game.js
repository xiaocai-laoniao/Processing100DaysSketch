/* 

 Game of Life 1 - simple code example
 Rules from wikipedia: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 
 Article disusssing artificial life and conway's game of life:
 http://makeyourownalgorithmicart.blogspot.co.uk/2018/05/artificial-life-and-conways-game-of-life.html

modified by Lee2sman
*/


// create cells
var number_of_rows = 200;
var number_of_columns = 200;
var grid_array = [];
let percentChance = 0.5; //how likely is a space to have life starting on it?

// cell size on screen
let cell_size = 6; //default


function setup() {
	createCanvas(800, 600);
	background('white');
	//noLoop();
	stroke(200);
	// slow down the calling of draw() so we can see the patterns evolve
	frameRate(30);
	
	// border
	noFill(); rect(0,0, width-1, height-1);
	
	
	// populate grid randomly
	for (var j = 0; j < number_of_rows; j += 1) {
		for (var i = 0; i < number_of_columns; i += 1) {
			
			// convert (i,j) to position in array
			var index = i + (j * number_of_columns);
			
			// set cell value to either 0 or 1, but mostly 0
			grid_array[index] = 0;
			if (random() < percentChance) {
				grid_array[index] = 1;
			}
			
		}
	}
	
}

function draw() {
  
	// draw grid
	for (var j = 0; j < number_of_rows; j += 1) {
		for (var i = 0; i < number_of_columns; i += 1) {
			
			// convert (i,j) to position in array
			var index = i + (j * number_of_columns);
			
			// get current value and draw cell
			var cell_value = grid_array[index];
			fill((1-cell_value) * 255);
			rect(i*cell_size, j*cell_size, cell_size, cell_size);
			
		}
	}
	
	// initialise new temporary array
	var grid_array_2 = [];
	for (var j = 0; j < number_of_rows; j += 1) {
		for (var i = 0; i < number_of_columns; i += 1) {
			// convert (i,j) to position in array
			var index = i + (j * number_of_columns);
			grid_array_2[index] = 0;
		}
	}
	
	// update grid	
	for (var j = 0; j < number_of_rows; j += 1) {
		for (var i = 0; i < number_of_columns; i += 1) {
			
			// get number of neighbours
			var neighbours = 0;
			// look at immediate neighbourhood
			for (y = -1; y <= 1; y +=1 ){
				for (x = -1; x <= 1; x +=1 ){
					
					// wrap coordinates around
					var wrapped_i = (i + x + number_of_columns) % number_of_columns;
					var wrapped_j = (j + y + number_of_rows) % number_of_rows;
					
					// don't include current cell, only neighbours
					if (!(x == 0 && y == 0)) {
						// convert (i,j) to position in array
						var index = (wrapped_i) + (wrapped_j * number_of_columns);
						neighbours += grid_array[index];
					}
					
				}
			}
			
			
			// apply rules
			
			// convert (i,j) to position in array
			var index = i + (j * number_of_columns);
			
			// Rule 1. Any live cell with fewer than two live neighbors dies, as if caused by under population.
			if (grid_array[index] == 1 && neighbours < 2) {
				grid_array_2[index] = 0;
			}
			// Rule 2. Any live cell with two or three live neighbors lives on to the next generation.
			if (grid_array[index] == 1 && (neighbours == 2 || neighbours == 3)) {
				grid_array_2[index] = 1;
			}
			// Rule 3. Any live cell with more than three live neighbors dies, as if by overpopulation.
			if (grid_array[index] == 1 && neighbours > 3) {
				grid_array_2[index] = 0;
			}
			// Rule 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
			if (grid_array[index] == 0 && neighbours == 3) {
				grid_array_2[index] = 1;
			}
			
		}
	}
	
	// point grid_array to new array, old one should be garbage collected
	grid_array = grid_array_2;
  
  drawFrame();
	
}

function drawFrame(){
  fill(250,0,0);
  textSize(cell_size);
  textAlign(LEFT);
  text(frameCount,cell_size/2,cell_size)
}