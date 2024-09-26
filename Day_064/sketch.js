function setup() {
    createCanvas(800, 800);
    frameRate(30);
    textSize(32);
    textAlign(CENTER, CENTER);
}


function draw() {
    background('#F4FF52');

    if (navigator.vibrate) {
        text("您的设备支持震动，点击屏幕试试", width / 2, height / 2);
    } else {
        text("您的设备不支持震动", width / 2, height / 2);
    }
}

function touchEnded() {
    if (navigator.vibrate) {
        navigator.vibrate([500, 500, 500, 500, 500, 500, 500, 500, 500, 500]);
    }
}