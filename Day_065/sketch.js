let xoff = 0.0;
let yoff = 0.0;
let position;
let deltaSlider, lodSlider, falloffSlider;
let sliderValueP, lodValueP, falloffValueP;

function setup() {
    createCanvas(1000, 1000);
    background(0);

    position = createVector(width / 2, height / 2);
    fill(255, 0, 0);
    noStroke();

    deltaSlider = createSlider(0.0, 1.0, 0.0, 0.01);
    deltaSlider.position(10, 10);

    sliderValueP = createP();
    sliderValueP.position(10, 30);
    sliderValueP.style('color', '#fff');
    sliderValueP.style('font-size', '12px');

    lodSlider = createSlider(1, 30, 30, 1);
    lodSlider.position(150, 10);

    lodValueP = createP();
    lodValueP.position(150, 30);
    lodValueP.style('color', '#fff');
    lodValueP.style('font-size', '12px');

    falloffSlider = createSlider(0.0, 1.0, 0.65, 0.01);
    falloffSlider.position(290, 10);

    falloffValueP = createP();
    falloffValueP.position(290, 30);
    falloffValueP.style('color', '#fff');
    falloffValueP.style('font-size', '12px');
}

function draw() {
    // background(0);

    let delta = deltaSlider.value();
    sliderValueP.html('Delta Slider Value: ' + delta);

    let lod = lodSlider.value();
    lodValueP.html('LOD Slider Value: ' + lod);

    let falloff = falloffSlider.value();
    falloffValueP.html('Falloff Slider Value: ' + falloff);
    
    noiseDetail(lod, falloff);
    let noiseValue = noise(xoff, yoff);
    let angle = (noiseValue - delta) * TWO_PI;
    console.log("noiseValue: ", noiseValue, "angle: ", angle);

    let vel = p5.Vector.fromAngle(angle);
    vel.mult(random(0.5, 1));
    position.add(vel);

    ellipse(position.x, position.y, 2, 2);

    xoff += 100;
    yoff += 100;

    position.x = constrain(position.x, 0, width);
    position.y = constrain(position.y, 0, height);

}