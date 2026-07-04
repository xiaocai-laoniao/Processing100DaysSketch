window.BeatArchitectureScene = class BeatArchitectureScene {
  constructor() {
    this.blocks = [];
    this.beams = [];
    this.signals = [];
    this.pulses = [];
    this.columnEnergy = [];
    this.bgLayer = null;
    this.trailLayer = null;
    this.floorPulse = 0;
  }

  rebuild() {
    randomSeed(CONFIG.seed + 317);
    noiseSeed(CONFIG.seed + 317);
    this.blocks = [];
    this.beams = [];
    this.signals = [];
    this.pulses = [];
    this.columnEnergy = Array.from({ length: 16 }, () => 0);
    this.floorPulse = 0;
    this.bgLayer = createGraphics(width, height);
    this.trailLayer = createGraphics(width, height);
    this.bgLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.clear();
    this.paintBackground();
  }

  onRestart() {
    this.rebuild();
    this.pulses.push(new ArchitecturePulse(width * 0.5, height * 0.78, width * 0.08, 190, 0.6));
  }

  onLoop() {
    this.floorPulse = 1;
    this.pulses.push(new ArchitecturePulse(width * 0.5, height * 0.78, width * 0.14, 42, 0.7));
  }

  paintBackground() {
    const ctx = this.bgLayer.drawingContext;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#080c18');
    grad.addColorStop(0.55, '#090712');
    grad.addColorStop(1, '#020203');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    this.bgLayer.noFill();
    this.bgLayer.stroke(188, 36, 76, 4);
    this.bgLayer.strokeWeight(1);
    const horizon = height * 0.72;
    for (let i = 0; i < 12; i++) {
      const y = lerp(horizon, height * 0.94, i / 11);
      this.bgLayer.line(width * 0.08, y, width * 0.92, y);
    }
    for (let i = 0; i <= 16; i++) {
      const x = this.columnX(i);
      this.bgLayer.line(x, height * 0.2, lerp(x, width * 0.5, 0.18), height * 0.94);
    }

    this.bgLayer.noStroke();
    for (let i = 0; i < 900; i++) {
      const x = random(width);
      const y = random(height * 0.06, height * 0.72);
      this.bgLayer.fill(random([188, 210, 274, 318]), 35, random(16, 52), random(3, 12));
      this.bgLayer.circle(x, y, random(0.35, 1.5));
    }
  }

  draw(playhead, energy) {
    this.fadeTrail();
    image(this.bgLayer, 0, 0);
    image(this.trailLayer, 0, 0);
    this.drawGround(playhead, energy);

    blendMode(ADD);
    this.updatePulses();
    this.updateBlocks(playhead);
    this.updateBeams();
    this.updateSignals();
    blendMode(BLEND);

    for (let i = 0; i < this.columnEnergy.length; i++) this.columnEnergy[i] *= 0.91;
    this.floorPulse *= 0.9;
  }

  fadeTrail() {
    this.trailLayer.push();
    this.trailLayer.blendMode(BLEND);
    this.trailLayer.noStroke();
    this.trailLayer.fill(230, 60, 3, 13);
    this.trailLayer.rect(0, 0, width, height);
    this.trailLayer.pop();
  }

  drawGround(playhead, energy) {
    const horizon = height * 0.72;
    noFill();
    for (let i = 0; i < 16; i++) {
      const x = this.columnX(i);
      const alpha = 7 + this.columnEnergy[i] * 40 + this.floorPulse * 12;
      stroke(188 + i * 5, 42, 88, alpha);
      strokeWeight(0.8 + this.columnEnergy[i] * 2.4);
      line(x, height * 0.2, lerp(x, width * 0.5, 0.18), height * 0.93);
    }

    stroke(42, 58, 100, 12 + energy * 28 + this.floorPulse * 20);
    strokeWeight(1.2);
    beginShape();
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const x = lerp(width * 0.08, width * 0.92, t);
      const y = horizon + Math.sin(t * PI * 6 + playhead * 0.8) * height * 0.012;
      vertex(x, y);
    }
    endShape();
  }

  handleEvent(ev) {
    const track = TRACKS[ev.track];
    if (ev.track === 'pulse') {
      this.triggerPulse(ev, track);
      this.trim();
      return;
    }

    const p = this.noteToBuildPoint(ev);
    const col = this.columnForBeat(ev.beat);
    this.columnEnergy[col] = Math.min(1.6, this.columnEnergy[col] + ev.velocity * 0.45);

    if (ev.track === 'bass') {
      this.blocks.push(new ArchitectureBlock(p.x, p.y + height * 0.08, width * 0.05, height * 0.12, track.hue, ev.velocity, 'foundation'));
      this.pulses.push(new ArchitecturePulse(p.x, height * 0.75, width * 0.045, track.hue, ev.velocity));
    } else if (ev.track === 'harmony') {
      this.blocks.push(new ArchitectureBlock(p.x, p.y, width * 0.034, height * 0.085, track.hue, ev.velocity, 'tower'));
      const span = this.columnX(Math.min(15, col + 2));
      this.beams.push(new ArchitectureBeam(p.x, p.y, span, p.y - height * 0.035, track.hue, ev.velocity));
    } else if (ev.track === 'lead') {
      this.signals.push(new ArchitectureSignal(p.x, p.y, track.hue, ev.velocity, ev.note));
      if (this.signals.length > 1) {
        const prev = this.signals[this.signals.length - 2];
        this.beams.push(new ArchitectureBeam(prev.x, prev.y, p.x, p.y, track.hue, ev.velocity * 0.7));
      }
    } else if (ev.track === 'shimmer') {
      this.signals.push(new ArchitectureSignal(p.x, p.y - height * 0.08, track.hue, ev.velocity, ev.note, true));
    }

    this.trim();
  }

  triggerPulse(ev, track) {
    const col = this.columnForBeat(ev.beat);
    const x = this.columnX(col);
    if (ev.drum === 'kick') {
      this.floorPulse = Math.min(1.4, this.floorPulse + ev.velocity * 0.75);
      this.columnEnergy[col] = Math.min(1.8, this.columnEnergy[col] + ev.velocity);
      this.blocks.push(new ArchitectureBlock(x, height * 0.78, width * 0.07, height * 0.05, track.hue, ev.velocity, 'beat'));
      this.pulses.push(new ArchitecturePulse(x, height * 0.78, width * 0.06, track.hue, ev.velocity));
    } else if (ev.drum === 'snare') {
      this.beams.push(new ArchitectureBeam(width * 0.14, height * 0.58, width * 0.86, height * 0.5 + (col % 3) * height * 0.045, 318, ev.velocity));
    } else {
      this.signals.push(new ArchitectureSignal(x, height * 0.22, 190, ev.velocity * 0.55, 84, true));
    }
  }

  noteToBuildPoint(ev) {
    const col = this.columnForBeat(ev.beat);
    const pitch = pitchNorm(ev.note);
    const x = this.columnX(col) + (hash01(ev.note * 17 + ev.beat * 13) - 0.5) * width * 0.036;
    const trackLift = {
      bass: height * 0.08,
      harmony: 0,
      lead: -height * 0.055,
      shimmer: -height * 0.11,
    }[ev.track] || 0;
    return {
      x,
      y: constrain(height * lerp(0.76, 0.22, pitch) + trackLift, height * 0.16, height * 0.82),
    };
  }

  columnForBeat(beat) {
    return clampInt((beat / SCORE.beats) * 16, 0, 15);
  }

  columnX(col) {
    return width * (0.12 + (col / 15) * 0.76);
  }

  updateBlocks(playhead) {
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i];
      block.update(playhead);
      block.paintTrail(this.trailLayer);
      block.display();
      if (block.dead()) this.blocks.splice(i, 1);
    }
  }

  updateBeams() {
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const beam = this.beams[i];
      beam.update();
      beam.display();
      if (beam.dead()) this.beams.splice(i, 1);
    }
  }

  updateSignals() {
    noStroke();
    for (let i = this.signals.length - 1; i >= 0; i--) {
      const signal = this.signals[i];
      signal.update();
      signal.paintTrail(this.trailLayer);
      signal.display();
      if (signal.dead()) this.signals.splice(i, 1);
    }
  }

  updatePulses() {
    noFill();
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.update();
      pulse.display();
      if (pulse.dead()) this.pulses.splice(i, 1);
    }
  }

  trim() {
    if (this.blocks.length > 96) this.blocks.splice(0, this.blocks.length - 96);
    if (this.beams.length > 80) this.beams.splice(0, this.beams.length - 80);
    if (this.signals.length > 140) this.signals.splice(0, this.signals.length - 140);
    if (this.pulses.length > 48) this.pulses.splice(0, this.pulses.length - 48);
  }
};

class ArchitectureBlock {
  constructor(x, y, w, h, hue, energy, kind) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.w = w;
    this.h = h;
    this.hue = hue;
    this.energy = energy;
    this.kind = kind;
    this.life = kind === 'foundation' ? 1.25 : 1;
    this.decay = kind === 'foundation' ? 0.0042 : 0.0075;
    this.phase = random(TWO_PI);
  }

  update(playhead) {
    this.px = this.x;
    this.py = this.y;
    this.y += Math.sin(playhead * 0.7 + this.phase) * 0.05 - 0.02 * this.energy;
    this.life -= this.decay;
  }

  display() {
    const alpha = Math.min(1, this.life);
    const lift = this.kind === 'beat' ? Math.sin(this.phase + frameCount * 0.16) * this.h * 0.18 : 0;
    const x = this.x;
    const y = this.y + lift;
    const depth = this.w * 0.32;

    noStroke();
    fill(this.hue, 56, 76, 34 * alpha);
    rectMode(CENTER);
    rect(x, y, this.w, this.h, 2);
    fill((this.hue + 22) % 360, 42, 100, 18 * alpha);
    beginShape();
    vertex(x + this.w * 0.5, y - this.h * 0.5);
    vertex(x + this.w * 0.5 + depth, y - this.h * 0.5 - depth * 0.5);
    vertex(x + this.w * 0.5 + depth, y + this.h * 0.5 - depth * 0.5);
    vertex(x + this.w * 0.5, y + this.h * 0.5);
    endShape(CLOSE);
    fill((this.hue + 44) % 360, 22, 100, 12 * alpha);
    beginShape();
    vertex(x - this.w * 0.5, y - this.h * 0.5);
    vertex(x + this.w * 0.5, y - this.h * 0.5);
    vertex(x + this.w * 0.5 + depth, y - this.h * 0.5 - depth * 0.5);
    vertex(x - this.w * 0.5 + depth, y - this.h * 0.5 - depth * 0.5);
    endShape(CLOSE);
    rectMode(CORNER);

    stroke(this.hue, 34, 100, 42 * alpha);
    strokeWeight(0.8 + this.energy);
    line(x - this.w * 0.45, y - this.h * 0.32, x + this.w * 0.42, y - this.h * 0.32);
    line(x - this.w * 0.45, y + this.h * 0.05, x + this.w * 0.42, y + this.h * 0.05);
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 54, 100, 8 * Math.min(1, this.life));
    buffer.strokeWeight(1);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0;
  }
}

class ArchitectureBeam {
  constructor(ax, ay, bx, by, hue, energy) {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
  }

  update() {
    this.life -= 0.018;
  }

  display() {
    stroke(this.hue, 52, 100, 28 * this.life);
    strokeWeight(1 + this.energy * 2.2);
    line(this.ax, this.ay, this.bx, this.by);
    stroke((this.hue + 40) % 360, 18, 100, 10 * this.life);
    strokeWeight(5 + this.energy * 6);
    line(this.ax, this.ay, this.bx, this.by);
  }

  dead() {
    return this.life <= 0;
  }
}

class ArchitectureSignal {
  constructor(x, y, hue, energy, note, antenna = false) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.hue = (hue + note * 1.2) % 360;
    this.energy = energy;
    this.antenna = antenna;
    this.life = antenna ? 0.75 : 1;
    this.decay = antenna ? 0.018 : 0.012;
    this.vx = random(-0.28, 0.28);
    this.vy = random(-0.8, -0.22);
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.97;
    this.vy *= 0.975;
    this.life -= this.decay;
  }

  display() {
    fill(this.hue, 48, 100, 46 * this.life);
    circle(this.x, this.y, this.antenna ? 3 + this.energy * 4 : 5 + this.energy * 7);
    if (this.antenna) {
      stroke(this.hue, 42, 100, 34 * this.life);
      strokeWeight(0.8);
      line(this.x, this.y, this.x, this.y + height * 0.08);
    }
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 56, 100, 12 * this.life);
    buffer.strokeWeight(0.6 + this.energy);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0 || this.y < -40;
  }
}

class ArchitecturePulse {
  constructor(x, y, radius, hue, energy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
  }

  update() {
    this.radius += width * (0.006 + this.energy * 0.006);
    this.life -= 0.03;
  }

  display() {
    stroke(this.hue, 62, 100, 24 * this.life);
    strokeWeight(1 + this.energy * 2.4);
    ellipse(this.x, this.y, this.radius * 2.5, this.radius * 0.7);
  }

  dead() {
    return this.life <= 0;
  }
}
