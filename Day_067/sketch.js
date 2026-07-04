const CONFIG = {
  seed: 67023,
  maxDepth: 9,
  rootCount: 9,
  baseLength: 178,
  branchShrink: 0.69,
  pulseSpeed: 0.018,
};

const PALETTE = {
  abyss: [225, 48, 4],
  dusk: [226, 42, 11],
  vein: [190, 74, 90],
  gold: [42, 82, 94],
  coral: [7, 68, 96],
  violet: [266, 70, 90],
};

let segments = [];
let spores = [];
let stars = [];
let bgLayer;
let fieldSize = 900;

function setup() {
  pixelDensity(1);
  const host = document.getElementById('canvas-wrap');
  fieldSize = Math.floor(Math.min(host.clientWidth, host.clientHeight));
  const canvas = createCanvas(fieldSize, fieldSize);
  canvas.parent('canvas-wrap');
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  frameRate(60);
  rebuild();
}

function draw() {
  image(bgLayer, 0, 0);

  const t = frameCount;
  const center = createVector(width * 0.5, height * 0.5);
  const mouse = mouseInside() ? createVector(mouseX, mouseY) : center.copy();

  blendMode(ADD);
  drawingContext.lineCap = 'round';
  drawingContext.lineJoin = 'round';

  for (const seg of segments) {
    const weight = seg.weight * (0.76 + 0.22 * Math.sin(t * CONFIG.pulseSpeed + seg.phase));
    const lift = gravityLift(seg, mouse, center);
    const a = 7 + seg.depth * 4.5;
    const hue = (seg.hue + 12 * Math.sin(t * 0.006 + seg.phase)) % 360;

    stroke(hue, 78, 95, a * 0.28);
    strokeWeight(weight * 4.4);
    bezier(seg.x1, seg.y1, seg.cx + lift.x, seg.cy + lift.y, seg.cx2 + lift.x, seg.cy2 + lift.y, seg.x2, seg.y2);

    stroke(hue, 68, 92, a);
    strokeWeight(weight);
    bezier(seg.x1, seg.y1, seg.cx + lift.x * 0.35, seg.cy + lift.y * 0.35, seg.cx2 + lift.x * 0.35, seg.cy2 + lift.y * 0.35, seg.x2, seg.y2);
  }

  drawSpores(t, mouse);
  drawBudConstellations(t);
  blendMode(BLEND);
}

function rebuild() {
  randomSeed(CONFIG.seed);
  noiseSeed(CONFIG.seed);
  segments = [];
  spores = [];
  stars = [];
  bgLayer = createGraphics(width, height);
  bgLayer.colorMode(HSB, 360, 100, 100, 100);
  paintBackground();
  growFractal();
}

function paintBackground() {
  const ctx = bgLayer.drawingContext;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const grad = ctx.createRadialGradient(cx, cy, width * 0.04, cx, cy, width * 0.78);
  grad.addColorStop(0, '#19213a');
  grad.addColorStop(0.36, '#0b1020');
  grad.addColorStop(1, '#020308');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  bgLayer.noStroke();
  for (let i = 0; i < 4400; i++) {
    const x = random(width);
    const y = random(height);
    const d = dist(x, y, cx, cy) / width;
    const n = fbm(x * 0.008, y * 0.008, 4);
    const alpha = 2 + 12 * n * Math.max(0, 1 - d * 1.15);
    bgLayer.fill(218 + n * 36, 40, 18 + n * 20, alpha);
    bgLayer.circle(x, y, random(0.45, 1.7));
  }

  for (let i = 0; i < 320; i++) {
    const a = random(TWO_PI);
    const r = Math.pow(random(), 0.56) * width * 0.47;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    stars.push({ x, y, s: random(0.45, 2.2), h: random([190, 42, 266]), p: random(TWO_PI) });
  }

  bgLayer.stroke(214, 22, 75, 4);
  bgLayer.strokeWeight(1);
  for (let r = width * 0.12; r < width * 0.52; r += width * 0.052) {
    bgLayer.circle(cx, cy, r * 2);
  }
}

function growFractal() {
  const cx = width * 0.5;
  const cy = height * 0.5;
  for (let i = 0; i < CONFIG.rootCount; i++) {
    const a = -HALF_PI + i * TWO_PI / CONFIG.rootCount + random(-0.1, 0.1);
    const length = CONFIG.baseLength * random(0.82, 1.16);
    branch(cx, cy, a, length, CONFIG.maxDepth, i);
  }
}

function branch(x, y, angle, len, depth, lineage) {
  if (depth <= 0 || len < 4.8) {
    spores.push({ x, y, r: random(1.8, 5.8), hue: random([PALETTE.gold[0], PALETTE.coral[0], PALETTE.vein[0]]), phase: random(TWO_PI) });
    return;
  }

  const warp = (fbm(x * 0.006 + lineage, y * 0.006 - lineage, 3) - 0.5) * 0.9;
  const sweep = angle + warp + random(-0.12, 0.12);
  const endX = x + Math.cos(sweep) * len;
  const endY = y + Math.sin(sweep) * len;
  const bend = random(-0.42, 0.42) * len;
  const nx = -Math.sin(sweep);
  const ny = Math.cos(sweep);
  const hueShift = map(depth, 1, CONFIG.maxDepth, 34, 190);

  segments.push({
    x1: x,
    y1: y,
    cx: lerp(x, endX, 0.34) + nx * bend,
    cy: lerp(y, endY, 0.34) + ny * bend,
    cx2: lerp(x, endX, 0.72) - nx * bend * 0.38,
    cy2: lerp(y, endY, 0.72) - ny * bend * 0.38,
    x2: endX,
    y2: endY,
    depth,
    hue: (lineage * 31 + hueShift + random(-18, 18)) % 360,
    weight: Math.max(0.35, depth * 0.46),
    phase: random(TWO_PI),
  });

  const split = depth > 6 ? 3 : (random() < 0.23 ? 3 : 2);
  for (let i = 0; i < split; i++) {
    const side = i - (split - 1) * 0.5;
    const flare = map(depth, 1, CONFIG.maxDepth, 0.25, 0.72);
    const nextAngle = sweep + side * flare + random(-0.22, 0.22);
    const nextLen = len * CONFIG.branchShrink * random(0.72, 1.04);
    branch(endX, endY, nextAngle, nextLen, depth - 1, lineage + i * 0.73 + depth * 0.11);
  }

  if (depth > 3 && random() < 0.38) {
    branch(lerp(x, endX, random(0.42, 0.72)), lerp(y, endY, random(0.42, 0.72)), sweep + random([-1, 1]) * random(0.7, 1.25), len * random(0.26, 0.42), depth - 3, lineage + 4.7);
  }
}

function drawSpores(t, mouse) {
  noStroke();

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = 0.48 + 0.52 * Math.sin(t * 0.025 + s.p);
    fill(s.h, 36, 100, 10 + twinkle * 30);
    circle(s.x, s.y, s.s * twinkle);
  }

  for (let i = 0; i < segments.length; i += 5) {
    const seg = segments[i];
    const u = (t * 0.0028 + seg.phase * 0.159) % 1;
    const pt = cubicPoint(seg, easeInOutCubic(u));
    const pull = p5.Vector.sub(mouse, createVector(pt.x, pt.y)).mult(0.006);
    fill((seg.hue + 28) % 360, 55, 100, 20);
    circle(pt.x + pull.x, pt.y + pull.y, 1.7 + (CONFIG.maxDepth - seg.depth) * 0.11);
  }
}

function drawBudConstellations(t) {
  for (const b of spores) {
    const breath = 0.72 + 0.28 * Math.sin(t * 0.028 + b.phase);
    fill(b.hue, 64, 100, 14);
    circle(b.x, b.y, b.r * 2.8 * breath);
    fill((b.hue + 20) % 360, 30, 100, 58);
    circle(b.x, b.y, b.r * breath);
  }
}

function gravityLift(seg, mouse, center) {
  const midX = (seg.x1 + seg.x2) * 0.5;
  const midY = (seg.y1 + seg.y2) * 0.5;
  const mx = mouse.x - midX;
  const my = mouse.y - midY;
  const dSq = mx * mx + my * my + 900;
  const influence = Math.min(18, 54000 / dSq) * (1 - seg.depth / (CONFIG.maxDepth + 2));
  const orbit = Math.sin(frameCount * 0.01 + seg.phase) * 2.2;
  return createVector(mx * influence * 0.035 + orbit, my * influence * 0.035 - orbit * 0.4);
}

function cubicPoint(seg, t) {
  const inv = 1 - t;
  return {
    x: inv ** 3 * seg.x1 + 3 * inv ** 2 * t * seg.cx + 3 * inv * t ** 2 * seg.cx2 + t ** 3 * seg.x2,
    y: inv ** 3 * seg.y1 + 3 * inv ** 2 * t * seg.cy + 3 * inv * t ** 2 * seg.cy2 + t ** 3 * seg.y2,
  };
}

function fbm(x, y, octaves) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  let total = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise(x * freq, y * freq) * amp;
    total += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return value / total;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function mouseInside() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('Day_067_mycelium_star_map', 'png');
  if (key === 'r' || key === 'R') {
    CONFIG.seed = Math.floor(random(1000000));
    rebuild();
  }
}

function windowResized() {
  const host = document.getElementById('canvas-wrap');
  const nextSize = Math.floor(Math.min(host.clientWidth, host.clientHeight));
  if (Math.abs(nextSize - fieldSize) > 2) {
    fieldSize = nextSize;
    resizeCanvas(fieldSize, fieldSize);
    rebuild();
  }
}
