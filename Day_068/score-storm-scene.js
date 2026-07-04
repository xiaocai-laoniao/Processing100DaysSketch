window.ScoreStormScene = class ScoreStormScene {
  constructor() {
    this.glyphs = [];
    this.sparks = [];
    this.vortices = [];
    this.bolts = [];
    this.staffBands = [];
    this.bgLayer = null;
    this.trailLayer = null;
    this.stormPulse = 0;
  }

  rebuild() {
    randomSeed(CONFIG.seed + 211);
    noiseSeed(CONFIG.seed + 211);
    this.glyphs = [];
    this.sparks = [];
    this.vortices = [];
    this.bolts = [];
    this.staffBands = [];
    this.stormPulse = 0;
    this.bgLayer = createGraphics(width, height);
    this.trailLayer = createGraphics(width, height);
    this.bgLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.clear();
    this.paintBackground();
  }

  onRestart() {
    this.rebuild();
    this.vortices.push(new ScoreStormVortex(width * 0.5, height * 0.5, width * 0.18, 188, 0.6));
  }

  onLoop() {
    this.stormPulse = 1.2;
    this.vortices.push(new ScoreStormVortex(width * 0.5, height * 0.5, width * 0.2, 274, 0.45));
  }

  paintBackground() {
    const ctx = this.bgLayer.drawingContext;
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.05, width * 0.5, height * 0.48, width * 0.82);
    grad.addColorStop(0, '#141227');
    grad.addColorStop(0.38, '#05091a');
    grad.addColorStop(1, '#010207');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    this.bgLayer.noFill();
    for (let i = 0; i < 38; i++) {
      const r = width * (0.08 + i * 0.018);
      const hue = 200 + i * 2.2;
      this.bgLayer.stroke(hue, 44, 68, 2.8);
      this.bgLayer.strokeWeight(i % 4 === 0 ? 1.2 : 0.55);
      this.bgLayer.arc(width * 0.5, height * 0.5, r * 2, r * 1.5, random(TWO_PI), random(TWO_PI) + PI);
    }

    this.bgLayer.noStroke();
    for (let i = 0; i < 1200; i++) {
      const a = random(TWO_PI);
      const r = random(width * 0.04, width * 0.72);
      const x = width * 0.5 + Math.cos(a) * r;
      const y = height * 0.5 + Math.sin(a) * r * 0.74;
      const glow = random(5, 30);
      this.bgLayer.fill(185 + random(120), 38, glow, random(4, 15));
      this.bgLayer.circle(x, y, random(0.4, 1.6));
    }
  }

  draw(playhead, energy) {
    this.fadeTrail();
    image(this.bgLayer, 0, 0);
    image(this.trailLayer, 0, 0);
    this.drawStaffStorm(playhead, energy);

    blendMode(ADD);
    this.updateVortices();
    this.updateBolts();
    this.updateGlyphs(playhead, energy);
    this.updateSparks();
    blendMode(BLEND);

    this.stormPulse *= 0.9;
  }

  fadeTrail() {
    this.trailLayer.push();
    this.trailLayer.blendMode(BLEND);
    this.trailLayer.noStroke();
    this.trailLayer.fill(236, 70, 4, 12);
    this.trailLayer.rect(0, 0, width, height);
    this.trailLayer.pop();
  }

  drawStaffStorm(playhead, energy) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    noFill();
    for (let band = 0; band < 5; band++) {
      const offset = (band - 2) * height * 0.042;
      stroke(188 + band * 14, 34, 90, 7 + energy * 20);
      strokeWeight(band === 2 ? 1.4 : 0.7);
      beginShape();
      for (let i = 0; i <= 150; i++) {
        const t = i / 150;
        const a = t * TWO_PI * 1.42 + playhead * 0.13 + band * 0.22;
        const r = width * (0.16 + t * 0.43) + Math.sin(t * 18 + playhead * 0.8) * width * 0.018;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.72 + offset;
        vertex(x, y);
      }
      endShape();
    }
  }

  handleEvent(ev) {
    const track = TRACKS[ev.track];
    if (ev.track === 'pulse') {
      this.triggerPulse(ev, track);
      this.trim();
      return;
    }

    const p = this.noteToStormPoint(ev);
    this.glyphs.push(new ScoreStormGlyph(p.x, p.y, ev, track, p.angle, p.radius));
    this.spawnSparks(p.x, p.y, track.hue, ev.velocity, ev.track === 'shimmer' ? 18 : 10);

    if (ev.track === 'harmony') {
      this.vortices.push(new ScoreStormVortex(p.x, p.y, width * 0.035, track.hue, ev.velocity));
    } else if (ev.track === 'bass') {
      this.vortices.push(new ScoreStormVortex(p.x, p.y, width * 0.075, track.hue, ev.velocity * 1.1));
      this.stormPulse = Math.min(1.4, this.stormPulse + ev.velocity * 0.35);
    } else if (ev.track === 'lead') {
      const prev = this.glyphs[this.glyphs.length - 2];
      if (prev) this.bolts.push(new ScoreStormBolt(prev.x, prev.y, p.x, p.y, track.hue, ev.velocity));
    }

    this.trim();
  }

  triggerPulse(ev, track) {
    const a = scoreAngle(ev.beat);
    const r = ev.drum === 'kick' ? width * 0.2 : width * 0.32;
    const p = orbitPoint(a, r);
    if (ev.drum === 'kick') {
      this.stormPulse = Math.min(1.8, this.stormPulse + ev.velocity * 0.75);
      this.vortices.push(new ScoreStormVortex(width * 0.5, height * 0.5, width * 0.11, track.hue, ev.velocity));
      this.bolts.push(new ScoreStormBolt(width * 0.5, height * 0.5, p.x, p.y, track.hue, ev.velocity));
    } else if (ev.drum === 'snare') {
      this.bolts.push(new ScoreStormBolt(width * 0.18, p.y, width * 0.82, height - p.y, 318, ev.velocity));
    } else {
      this.spawnSparks(p.x, p.y, 190, ev.velocity * 0.55, 6);
    }
  }

  noteToStormPoint(ev) {
    const pitch = pitchNorm(ev.note);
    const baseAngle = scoreAngle(ev.beat);
    const spin = pitch * 1.35 + hash01(ev.note * 13 + ev.beat * 19) * 0.42;
    const radius = width * (0.13 + pitch * 0.36 + TRACKS[ev.track].lane[0] * 0.28);
    const angle = baseAngle + spin;
    const p = orbitPoint(angle, radius);
    return {
      x: lerp(p.x, width * 0.5, ev.track === 'bass' ? 0.16 : 0.04),
      y: lerp(p.y, height * 0.5, ev.track === 'bass' ? 0.12 : 0.02),
      angle,
      radius,
    };
  }

  spawnSparks(x, y, hue, velocity, count) {
    for (let i = 0; i < count; i++) {
      const a = random(TWO_PI);
      const speed = random(0.3, 2.8) * (0.35 + velocity);
      this.sparks.push(new ScoreStormSpark(x, y, Math.cos(a) * speed, Math.sin(a) * speed, hue, velocity));
    }
  }

  updateGlyphs(playhead, energy) {
    for (let i = this.glyphs.length - 1; i >= 0; i--) {
      const glyph = this.glyphs[i];
      glyph.update(playhead, energy + this.stormPulse * 0.32);
      glyph.paintTrail(this.trailLayer);
      glyph.display();
      if (glyph.dead()) this.glyphs.splice(i, 1);
    }
  }

  updateSparks() {
    noStroke();
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spark = this.sparks[i];
      spark.update();
      spark.paintTrail(this.trailLayer);
      spark.display();
      if (spark.dead()) this.sparks.splice(i, 1);
    }
  }

  updateVortices() {
    noFill();
    for (let i = this.vortices.length - 1; i >= 0; i--) {
      const vortex = this.vortices[i];
      vortex.update();
      vortex.display();
      if (vortex.dead()) this.vortices.splice(i, 1);
    }
  }

  updateBolts() {
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const bolt = this.bolts[i];
      bolt.update();
      bolt.display();
      if (bolt.dead()) this.bolts.splice(i, 1);
    }
  }

  trim() {
    if (this.glyphs.length > 96) this.glyphs.splice(0, this.glyphs.length - 96);
    if (this.sparks.length > 720) this.sparks.splice(0, this.sparks.length - 720);
    if (this.vortices.length > 42) this.vortices.splice(0, this.vortices.length - 42);
    if (this.bolts.length > 54) this.bolts.splice(0, this.bolts.length - 54);
  }
};

class ScoreStormGlyph {
  constructor(x, y, ev, track, angle, radius) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.angle = angle;
    this.radius = radius;
    this.note = ev.note;
    this.track = ev.track;
    this.hue = (track.hue + ev.note * 1.8) % 360;
    this.energy = ev.velocity;
    this.size = width * (0.008 + ev.velocity * 0.015);
    this.life = ev.track === 'harmony' ? 1.3 : 1;
    this.decay = ev.track === 'harmony' ? 0.006 : 0.011;
    this.phase = random(TWO_PI);
  }

  update(playhead, energy) {
    this.px = this.x;
    this.py = this.y;
    this.angle += 0.004 + this.energy * 0.004 + energy * 0.003;
    this.radius += Math.sin(playhead * 0.8 + this.phase) * 0.18;
    const p = orbitPoint(this.angle, this.radius);
    this.x = lerp(this.x, p.x, 0.055);
    this.y = lerp(this.y, p.y, 0.055);
    this.life -= this.decay;
    this.phase += 0.05;
  }

  display() {
    const alpha = Math.min(1, this.life);
    stroke(this.hue, 58, 100, 44 * alpha);
    strokeWeight(1.2 + this.energy * 1.5);
    noFill();
    const s = this.size * (1 + Math.sin(this.phase) * 0.12);
    if (this.track === 'harmony') {
      ellipse(this.x, this.y, s * 2.8, s * 1.6);
      line(this.x - s, this.y, this.x + s, this.y);
    } else if (this.track === 'bass') {
      rectMode(CENTER);
      rect(this.x, this.y, s * 2.1, s * 2.1, 2);
      rectMode(CORNER);
    } else {
      line(this.x, this.y - s * 1.8, this.x, this.y + s * 1.8);
      ellipse(this.x + s * 0.75, this.y + s * 1.25, s * 1.2, s * 0.86);
    }
    noStroke();
    fill((this.hue + 30) % 360, 34, 100, 60 * alpha);
    circle(this.x, this.y, s * 0.55);
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 64, 100, 12 * Math.min(1, this.life));
    buffer.strokeWeight(0.8 + this.energy);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0;
  }
}

class ScoreStormSpark {
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
    this.decay = random(0.012, 0.034);
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.vx *= 0.975;
    this.vy *= 0.975;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  display() {
    fill(this.hue, 54, 100, 52 * this.life);
    circle(this.x, this.y, 1.2 + this.energy * 3.4);
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 70, 100, 16 * this.life);
    buffer.strokeWeight(0.5 + this.energy * 0.8);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0 || this.x < -40 || this.x > width + 40 || this.y < -40 || this.y > height + 40;
  }
}

class ScoreStormVortex {
  constructor(x, y, radius, hue, energy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
    this.spin = random(TWO_PI);
  }

  update() {
    this.radius += width * (0.003 + this.energy * 0.005);
    this.spin += 0.08;
    this.life -= 0.022;
  }

  display() {
    stroke(this.hue, 58, 100, 25 * this.life);
    strokeWeight(1 + this.energy * 2);
    for (let i = 0; i < 3; i++) {
      arc(this.x, this.y, this.radius * (2 + i * 0.28), this.radius * (1.35 + i * 0.16), this.spin + i * 0.5, this.spin + PI * 1.35 + i * 0.5);
    }
  }

  dead() {
    return this.life <= 0;
  }
}

class ScoreStormBolt {
  constructor(ax, ay, bx, by, hue, energy) {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
    this.seed = random(1000);
  }

  update() {
    this.life -= 0.06;
  }

  display() {
    stroke(this.hue, 46, 100, 44 * this.life);
    strokeWeight(0.7 + this.energy * 2.2);
    noFill();
    beginShape();
    for (let i = 0; i <= 9; i++) {
      const t = i / 9;
      const wobble = (noise(this.seed + i * 0.2, frameCount * 0.03) - 0.5) * width * 0.025 * this.life;
      const x = lerp(this.ax, this.bx, t) + wobble;
      const y = lerp(this.ay, this.by, t) - wobble * 0.7;
      vertex(x, y);
    }
    endShape();
  }

  dead() {
    return this.life <= 0;
  }
}
