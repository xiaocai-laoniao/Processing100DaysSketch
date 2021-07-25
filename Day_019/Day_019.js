// study from https://gorillasun.de/blog/Modulating-Shapes-and-Creating-Patterns-in-P5JS-with-Sines-and-Cosines

// 理解 + 模仿

// 波浪方向
const WaveDirection = {
  x: "x",
  y: "y",
  x_y_1: "x_y_1",
  x_y_2: "x_y_2"
}


let grid;
let waveDirection = WaveDirection.x_y_1; // 默认方向
function setup() {
  createCanvas(800, 800);
  grid = new Grid();
  rectMode(CENTER); // unit的中心缩放
}

function draw() {
  background(255);

  grid.display();
}

function keyPressed() {
  if (keyCode == 81) { // Q键
    waveDirection = WaveDirection.x;
  } else if (keyCode == 87) { // W键
    waveDirection = WaveDirection.y;
  } else if (keyCode == 69) { // E
    waveDirection = WaveDirection.x_y_1;
  } else if (keyCode == 65) { // A
    waveDirection = WaveDirection.x_y_2;
  } else if (keyCode == 83) { // S save image
    save("Day_019.png");
  }
}

class Grid {
  constructor() {
    this.units = [];
    this.gridWidth = 30;
    this.gridHeight = 30;
    this.unitSize = 20;
    this.unitSpace = 4;
    this.startPosX = (width - this.unitSize * this.gridWidth - (this.gridWidth - 1) * this.unitSpace) / 2 + this.unitSize / 2;
    this.startPosY = (height - this.gridHeight * this.unitSize - (this.gridHeight - 1) * this.unitSpace) / 2 + this.unitSize / 2;

    for (let i = 0; i < this.gridWidth; i++) {
      let row = [];
      for (let j = 0; j < this.gridHeight; j++) {
        let posX = this.startPosX + (this.unitSize + this.unitSpace) * i;
        let posY = this.startPosY + (this.unitSize + this.unitSpace) * j;
        let unit = new Unit(posX, posY, this.unitSize);
        row.push(unit);
      }
      this.units.push(row);
    }
  }

  display() {
    for (let i = 0; i < this.gridWidth; i++) {
      for (let j = 0; j < this.gridHeight; j++) {
        this.units[i][j].display();
      }
    }
  }
}

class Unit {
  constructor(posX, posY, size) {
    this.posX = posX;
    this.posY = posY;
    this.size = size;
  }

  display() {
    strokeWeight(3);

    switch(waveDirection) {
      case WaveDirection.x:
        this.size = 20 + sin(this.posX + millis() / 500) * 14;
        break;
      case WaveDirection.y:
        this.size = 20 + sin(this.posY + millis() / 500) * 14;
        break;
      case WaveDirection.x_y_1:
        this.size = 20 + sin(this.posX + this.posY + millis() / 500) * 16;
        break;
      case WaveDirection.x_y_2:
        this.size = 20 + sin(this.posX - this.posY + millis() / 500) * 16;
        break;
    }
    let red = 100 + 155 * sin(this.posX + millis() / 500);
    let green = 100 + 155 * sin(this.posY + millis() / 500);
    let blue = 125;
    let alpha = 100 + 155 * sin(this.posX + this.posY + millis() / 500);
    fill(red, green, blue, alpha);

    rect(this.posX, this.posY, this.size, this.size, 8);
  }
}