// https://github.com/mrchantey/p5.createLoop


function setup() {
    createCanvas(300, 300)
    frameRate(30)
    createLoop({
        gif: {
            options: { quality: 2 },
            fileName: "Day_062.gif",
            startLoop: 1,
            endLoop: 2
        }
    })
    animLoop.noiseFrequency(0.6)
    background('#F4FF52')
	// blendMode(OVERLAY)
}

function drawUnit(centerX, centerY) {
    translate(centerX, centerY)
	rotate(animLoop.progress * TWO_PI)
    const x = cos(animLoop.theta) * 100
    const y = animLoop.noise() * 100

	const gray = map(animLoop.theta, 0, TWO_PI, 0, 255)
	const radius = map(gray, 0, 255, 10, 50)
	const alpha = map(gray, 0, 255, 0, 200)

	const b = animLoop.noise2D(x, y) * 255
	stroke(255 - b, 255 - b, 255 - b)
	fill(b, b, b, alpha)
    ellipse(x, y, radius, radius)
}

function draw() {
	drawUnit(width / 2, height / 2) 
}