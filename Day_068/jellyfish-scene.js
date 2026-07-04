window.JellyfishScene = class JellyfishScene {
  constructor() {
    this.jellies = [];
    this.ripples = [];
    this.sparkles = [];
    this.bubbles = [];
    this.currents = [];
    this.bgLayer = null;
    this.trailLayer = null;
    this.globalPulse = 0;
  }

  rebuild() {
    randomSeed(CONFIG.seed + 91);
    noiseSeed(CONFIG.seed + 91);
    this.jellies = [];
    this.ripples = [];
    this.sparkles = [];
    this.bubbles = [];
    this.currents = [];
    this.globalPulse = 0;

    this.bgLayer = createGraphics(width, height);
    this.trailLayer = createGraphics(width, height);
    this.bgLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.clear();
    this.paintBackground();
  }

  onRestart() {
    this.rebuild();
    this.ripples.push(new JellyRipple(width * 0.5, height * 0.5, width * 0.08, 190, 0.8));
  }

  onLoop() {
    this.globalPulse = 1;
    this.ripples.push(new JellyRipple(width * 0.5, height * 0.5, width * 0.11, 190, 0.55));
  }

  paintBackground() {
    const ctx = this.bgLayer.drawingContext;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#061324');
    grad.addColorStop(0.48, '#06101b');
    grad.addColorStop(1, '#020308');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.52;
    const cy = height * 0.44;
    const glow = ctx.createRadialGradient(cx, cy, width * 0.04, cx, cy, width * 0.72);
    glow.addColorStop(0, 'rgba(75, 214, 220, 0.18)');
    glow.addColorStop(0.44, 'rgba(79, 54, 146, 0.09)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    this.bgLayer.noStroke();
    for (let i = 0; i < 3800; i++) {
      const x = random(width);
      const y = random(height);
      const n = fbm(x * 0.007, y * 0.011, 4);
      this.bgLayer.fill(190 + n * 80, 34, 16 + n * 24, 3 + n * 9);
      this.bgLayer.circle(x, y, random(0.35, 1.4));
    }

    for (let i = 0; i < 140; i++) {
      this.bubbles.push(new JellyBubble(random(width), random(height), random(0.5, 2.8), random([178, 205, 286])));
    }

    this.bgLayer.noFill();
    this.bgLayer.stroke(188, 28, 75, 4);
    this.bgLayer.strokeWeight(1);
    for (let y = height * 0.18; y < height * 0.85; y += height * 0.12) {
      this.bgLayer.beginShape();
      for (let x = -20; x <= width + 20; x += 34) {
        const wave = Math.sin(x * 0.014 + y * 0.02) * height * 0.012;
        this.bgLayer.vertex(x, y + wave);
      }
      this.bgLayer.endShape();
    }
  }

  draw(playhead, energy) {
    this.fadeTrail();
    image(this.bgLayer, 0, 0);
    image(this.trailLayer, 0, 0);
    this.drawWaterColumn(playhead, energy);

    blendMode(ADD);
    this.updateRipples();
    this.updateBubbles(playhead, energy);
    this.updateJellies(playhead, energy);
    this.updateSparkles();
    this.drawTimeline(playhead, energy);
    blendMode(BLEND);

    this.globalPulse *= 0.92;
  }

  fadeTrail() {
    this.trailLayer.push();
    this.trailLayer.blendMode(BLEND);
    this.trailLayer.noStroke();
    this.trailLayer.fill(220, 52, 3, 10);
    this.trailLayer.rect(0, 0, width, height);
    this.trailLayer.pop();
  }

  handleEvent(ev) {
    const track = TRACKS[ev.track];
    if (ev.track === 'pulse') {
      this.triggerPulse(ev, track);
      this.trim();
      return;
    }

    const p = this.noteToSwimPoint(ev);
    const jelly = new NoteJellyfish(p.x, p.y, ev, track);
    this.jellies.push(jelly);
    this.spawnGlow(p.x, p.y, track.hue, ev.velocity, ev.track);

    if (ev.track === 'harmony') {
      this.ripples.push(new JellyRipple(p.x, p.y, width * 0.018, track.hue, ev.velocity * 0.42));
    } else if (ev.track === 'bass') {
      this.ripples.push(new JellyRipple(p.x, p.y, width * 0.04, track.hue, ev.velocity * 0.75));
      this.pulseNearby(p.x, p.y, width * 0.26, ev.velocity * 0.8);
    } else if (ev.track === 'lead') {
      this.pulseNearby(p.x, p.y, width * 0.14, ev.velocity * 0.52);
    }

    this.trim();
  }

  triggerPulse(ev, track) {
    if (ev.drum === 'kick') {
      this.globalPulse = Math.min(1.6, this.globalPulse + ev.velocity * 0.85);
      this.ripples.push(new JellyRipple(width * 0.5, height * 0.68, width * 0.08, track.hue, ev.velocity));
      this.pulseNearby(width * 0.5, height * 0.68, width * 0.65, ev.velocity * 0.45);
    } else if (ev.drum === 'snare') {
      const p = noteTimePoint({ ...ev, note: 72 }, 0.2);
      this.ripples.push(new JellyRipple(p.x, p.y, width * 0.024, 318, ev.velocity * 0.65));
    } else {
      this.spawnGlow(width * (0.12 + (ev.beat / SCORE.beats) * 0.76), height * 0.18, 190, ev.velocity * 0.55, 'hat');
    }
  }

  noteToSwimPoint(ev) {
    const p = noteTimePoint(ev, 0.18);
    const phase = fract01(ev.beat / SCORE.beats + hash01(ev.note * 31 + ev.beat * 7) * 0.42);
    const laneX = width * (0.16 + phase * 0.68);
    const trackOffset = {
      bass: height * 0.18,
      harmony: height * 0.06,
      lead: -height * 0.02,
      shimmer: -height * 0.1,
    }[ev.track] || 0;
    const drift = (hash01(ev.note * 19 + ev.beat * 11) - 0.5) * width * 0.045;
    return {
      x: lerp(p.x, laneX, 0.72) + drift,
      y: constrain(p.y + trackOffset, height * 0.2, height * 0.78),
    };
  }

  pulseNearby(x, y, radius, amount) {
    for (const jelly of this.jellies) {
      const d = dist(x, y, jelly.x, jelly.y);
      if (d < radius) jelly.pulse += (1 - d / radius) * amount;
    }
  }

  spawnGlow(x, y, hue, velocity, trackName) {
    const count = trackName === 'hat' ? 6 : Math.floor(7 + velocity * 13);
    for (let i = 0; i < count; i++) {
      const a = random(TWO_PI);
      const speed = random(0.35, trackName === 'lead' ? 2.6 : 1.8) * (0.4 + velocity);
      this.sparkles.push(new JellySparkle(x, y, Math.cos(a) * speed, Math.sin(a) * speed, hue, velocity));
    }
  }

  drawWaterColumn(playhead, energy) {
    noFill();
    const glow = 8 + energy * 22 + this.globalPulse * 18;
    stroke(184, 44, 84, glow);
    strokeWeight(1);
    for (let i = 0; i < 9; i++) {
      const y = height * (0.16 + i * 0.075);
      beginShape();
      for (let x = width * 0.08; x <= width * 0.92; x += 22) {
        const n = noise(x * 0.004, i * 0.27, playhead * 0.05);
        vertex(x, y + (n - 0.5) * height * 0.035);
      }
      endShape();
    }
  }

  drawTimeline(playhead, energy) {
    const x = width * (0.12 + (playhead / SCORE.duration) * 0.76);
    stroke(190, 50, 100, 10 + energy * 28);
    strokeWeight(1);
    line(x, height * 0.12, x, height * 0.9);
    noStroke();
    fill(190, 40, 100, 40 + energy * 32);
    circle(x, height * 0.92, 4 + energy * 9);
  }

  updateJellies(playhead, energy) {
    for (let i = this.jellies.length - 1; i >= 0; i--) {
      const jelly = this.jellies[i];
      jelly.update(playhead, energy + this.globalPulse * 0.35);
      jelly.paintTrail(this.trailLayer);
      jelly.display();
      if (jelly.dead()) this.jellies.splice(i, 1);
    }
  }

  updateRipples() {
    noFill();
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i];
      ripple.update();
      ripple.display();
      if (ripple.dead()) this.ripples.splice(i, 1);
    }
  }

  updateSparkles() {
    noStroke();
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sparkle = this.sparkles[i];
      sparkle.update();
      sparkle.paintTrail(this.trailLayer);
      sparkle.display();
      if (sparkle.dead()) this.sparkles.splice(i, 1);
    }
  }

  updateBubbles(playhead, energy) {
    noStroke();
    for (const bubble of this.bubbles) {
      bubble.update(playhead, energy + this.globalPulse * 0.2);
      bubble.display();
    }
  }

  trim() {
    if (this.jellies.length > 84) this.jellies.splice(0, this.jellies.length - 84);
    if (this.sparkles.length > 560) this.sparkles.splice(0, this.sparkles.length - 560);
    if (this.ripples.length > 64) this.ripples.splice(0, this.ripples.length - 64);
  }
};

class NoteJellyfish {
  constructor(x, y, ev, track) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = random(-0.4, 0.4);
    this.vy = random(-0.18, 0.28);
    this.note = ev.note;
    this.track = ev.track;
    this.hue = (track.hue + ev.note * 1.45) % 360;
    this.energy = ev.velocity;
    this.size = this.sizeFor(ev);
    this.tentacles = this.track === 'bass' ? 9 : this.track === 'harmony' ? 13 : 7;
    this.life = this.track === 'harmony' ? 1.35 : this.track === 'bass' ? 1.18 : 1;
    this.decay = this.track === 'harmony' ? 0.0038 : this.track === 'bass' ? 0.0046 : 0.008;
    this.phase = random(TWO_PI);
    this.pulse = ev.velocity * 1.15;
    this.tailSeed = random(1000);
  }

  sizeFor(ev) {
    if (ev.track === 'bass') return width * (0.038 + ev.velocity * 0.032);
    if (ev.track === 'harmony') return width * (0.032 + ev.velocity * 0.022);
    if (ev.track === 'shimmer') return width * (0.018 + ev.velocity * 0.018);
    return width * (0.022 + ev.velocity * 0.02);
  }

  update(playhead, energy) {
    this.px = this.x;
    this.py = this.y;
    const flow = curl(this.x * 0.004 + this.tailSeed, this.y * 0.004, playhead * 0.035);
    const buoyancy = this.track === 'bass' ? -0.003 : -0.006;
    this.vx += flow.x * 0.016 + Math.sin(playhead * 0.75 + this.phase) * 0.005;
    this.vy += flow.y * 0.011 + buoyancy - energy * 0.004;
    this.vx *= 0.985;
    this.vy *= 0.987;
    this.x += this.vx;
    this.y += this.vy;
    this.pulse *= 0.88;
    this.phase += 0.03 + this.energy * 0.02;
    this.life -= this.decay;

    if (this.y < height * 0.14) {
      this.y = lerp(this.y, height * 0.14, 0.04);
      this.vy += 0.12;
    }
    if (this.y > height * 0.86) this.vy -= 0.045;
    if (this.x < width * 0.06 || this.x > width * 0.94) this.vx *= -0.82;
  }

  display() {
    const bellPulse = 1 + this.pulse * 0.22 + Math.sin(this.phase) * 0.055;
    const w = this.size * bellPulse;
    const h = this.size * (0.66 + this.energy * 0.18);
    const alpha = Math.min(1, this.life);

    noStroke();
    fill(this.hue, 46, 100, 9 * alpha);
    ellipse(this.x, this.y, w * 2.6, h * 2.1);

    fill(this.hue, 58, 96, 26 * alpha);
    beginShape();
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const a = PI + t * PI;
      vertex(this.x + Math.cos(a) * w, this.y + Math.sin(a) * h * 0.95);
    }
    for (let i = 16; i >= 0; i--) {
      const t = i / 16;
      const sx = this.x + map(t, 0, 1, -w, w);
      const scallop = Math.sin(t * PI * this.tentacles) * h * 0.12;
      vertex(sx, this.y + h * 0.26 + scallop);
    }
    endShape(CLOSE);

    fill((this.hue + 36) % 360, 20, 100, 56 * alpha);
    ellipse(this.x, this.y - h * 0.18, w * 0.44, h * 0.32);

    this.drawTentacles(alpha, w, h);
  }

  drawTentacles(alpha, w, h) {
    drawingContext.lineCap = 'round';
    for (let i = 0; i < this.tentacles; i++) {
      const t = this.tentacles === 1 ? 0.5 : i / (this.tentacles - 1);
      const rootX = this.x + map(t, 0, 1, -w * 0.72, w * 0.72);
      const rootY = this.y + h * 0.24;
      const length = this.size * (1.8 + this.energy * 2.1) * (0.72 + hash01(this.tailSeed + i) * 0.65);
      const sway = Math.sin(this.phase * 1.5 + i * 0.74) * this.size * 0.32;
      const hue = (this.hue + i * 3) % 360;

      stroke(hue, 54, 100, 9 * alpha);
      strokeWeight(3.2);
      noFill();
      bezier(
        rootX,
        rootY,
        rootX + sway,
        rootY + length * 0.28,
        rootX - sway * 0.35,
        rootY + length * 0.74,
        rootX + sway * 0.65,
        rootY + length,
      );

      stroke((hue + 24) % 360, 28, 100, 36 * alpha);
      strokeWeight(0.7 + this.energy * 0.7);
      bezier(
        rootX,
        rootY,
        rootX + sway * 0.7,
        rootY + length * 0.28,
        rootX - sway * 0.28,
        rootY + length * 0.74,
        rootX + sway * 0.58,
        rootY + length,
      );
    }
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 62, 100, 10 * Math.min(1, this.life));
    buffer.strokeWeight(0.9 + this.energy * 1.2);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0 || this.y > height + this.size * 4 || this.x < -80 || this.x > width + 80;
  }
}

class JellyRipple {
  constructor(x, y, radius, hue, energy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
  }

  update() {
    this.radius += width * (0.004 + this.energy * 0.005);
    this.life -= 0.026;
  }

  display() {
    noFill();
    stroke(this.hue, 62, 100, 24 * this.life);
    strokeWeight(1 + this.energy * 2.6);
    ellipse(this.x, this.y, this.radius * 2.2, this.radius * 1.18);
    stroke((this.hue + 36) % 360, 30, 100, 9 * this.life);
    strokeWeight(8 + this.energy * 8);
    ellipse(this.x, this.y, this.radius * 2.25, this.radius * 1.22);
  }

  dead() {
    return this.life <= 0;
  }
}

class JellySparkle {
  constructor(x, y, vx, vy, hue, energy) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = vx;
    this.vy = vy;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
    this.decay = random(0.014, 0.032);
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.vy -= 0.008;
    this.vx *= 0.982;
    this.vy *= 0.982;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  display() {
    fill((this.hue + 18) % 360, 46, 100, 48 * this.life);
    circle(this.x, this.y, 1.2 + this.energy * 2.6);
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 58, 100, 14 * this.life);
    buffer.strokeWeight(0.45 + this.energy * 0.65);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0;
  }
}

class JellyBubble {
  constructor(x, y, size, hue) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hue = hue;
    this.phase = random(TWO_PI);
    this.speed = random(0.08, 0.32);
  }

  update(playhead, energy) {
    this.y -= this.speed * (0.6 + energy);
    this.x += Math.sin(playhead * 0.8 + this.phase + this.y * 0.01) * 0.18;
    if (this.y < -10) {
      this.y = height + random(10, 80);
      this.x = random(width);
    }
  }

  display() {
    const a = 8 + 16 * Math.sin(frameCount * 0.018 + this.phase) ** 2;
    fill(this.hue, 28, 100, a);
    circle(this.x, this.y, this.size);
  }
}
