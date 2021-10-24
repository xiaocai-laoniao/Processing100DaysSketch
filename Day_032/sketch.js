let model;
let predictionArr = [];

let canvas;
let capture;
let context;

const modelSettings = {
	flipHorizontal: true,
	maxNumBoxes: 10,
	iouThreshold: 0.5,
	scoreThreshold: 0.6
}

function runDetection() {
	model.detect(capture.elt).then(predictions => {
		predictionArr = predictions;
		model.renderPredictions(predictions, canvas, context, capture.elt); // 渲染检测值
		if (capture) {
			requestAnimationFrame(runDetection);
		}
	});
}

function setup() {
	canvas = createCanvas(640, 480);
	capture = createCapture(VIDEO, function() {
		handTrack.load(modelSettings).then(lmodel => {
			model = lmodel;
			runDetection();
		});
	});
	context = canvas.elt.getContext("2d");
	capture.hide();
	imageMode(CENTER);

	textAlign(LEFT, TOP);
	textStyle(BOLD);
}

function draw() {

  flipCamera();

  drawPredictions();
}

function flipCamera() {
  push();
  translate(width / 2, height / 2);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();
}

function drawPredictions() {
  predictionArr.forEach((item, i) => {
    // console.log(item);
    let w = item.bbox[2];
    let h = item.bbox[3];
    let x = item.bbox[0];
    let y = item.bbox[1];
    let centerX = x + w / 2;
    let centerY = y + h / 2;
    let score = item.score;
    let label = item.label;

    stroke(0);
    strokeWeight(2);
    fill(0, 100);
    rect(x, y, w, h, 10, 10, 10, 10);
    noStroke();
    fill(255);
    text(score, x + 10, y + 10);
    fill(255, 255, 0);
    text(label, x + 10, y + 40);

    if (item.label == "face") {
    } else if (item.label == "open") {
    } else if (item.label == "closed") {
    } else if (item.label == "point") {
    } else if (item.label == "pinch") {
    }
  });
}

function keyPressed() {
	if (key == 's') {
		saveCanvas(canvas, "Day_032.jpg");
	}
}