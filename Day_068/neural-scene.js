window.NeuralScene = class NeuralScene {
  constructor() {
    this.neurons = [];
    this.edges = [];
    this.rings = [];
    this.sparks = [];
    this.dust = [];
    this.chordBlooms = [];
    this.beatMarks = [];
    this.chordGroups = new Map();
    this.lastLeadNode = null;
    this.lastBassNode = null;
    this.bgLayer = null;
    this.trailLayer = null;
  }

  rebuild() {
    randomSeed(CONFIG.seed);
    noiseSeed(CONFIG.seed);
    this.neurons = [];
    this.edges = [];
    this.rings = [];
    this.sparks = [];
    this.dust = [];
    this.chordBlooms = [];
    this.beatMarks = [];
    this.chordGroups = new Map();
    this.lastLeadNode = null;
    this.lastBassNode = null;

    this.bgLayer = createGraphics(width, height);
    this.trailLayer = createGraphics(width, height);
    this.bgLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.colorMode(HSB, 360, 100, 100, 100);
    this.trailLayer.clear();
    this.paintBackground();
  }

  onRestart() {
    this.rebuild();
    this.rings.push(new NeuralRing(width * 0.5, height * 0.5, width * 0.08, 205, 0.75));
  }

  onLoop() {
    this.chordGroups.clear();
    this.lastLeadNode = null;
    this.lastBassNode = null;
    this.rings.push(new NeuralRing(width * 0.5, height * 0.5, width * 0.09, 205, 0.45));
  }

  paintBackground() {
    const ctx = this.bgLayer.drawingContext;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const grad = ctx.createRadialGradient(cx, cy, width * 0.04, cx, cy, width * 0.78);
    grad.addColorStop(0, '#17223c');
    grad.addColorStop(0.34, '#090d1a');
    grad.addColorStop(1, '#020307');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    this.bgLayer.noStroke();
    for (let i = 0; i < 5200; i++) {
      const x = random(width);
      const y = random(height);
      const centerFalloff = Math.max(0, 1 - dist(x, y, cx, cy) / (width * 0.72));
      const n = fbm(x * 0.008, y * 0.008, 4);
      this.bgLayer.fill(212 + n * 70, 42, 15 + n * 24, 3 + centerFalloff * 15);
      this.bgLayer.circle(x, y, random(0.35, 1.55));
    }

    this.bgLayer.noFill();
    this.bgLayer.stroke(204, 24, 80, 4);
    this.bgLayer.strokeWeight(1);
    for (let r = width * 0.12; r < width * 0.5; r += width * 0.056) {
      this.bgLayer.circle(cx, cy, r * 2);
    }

    for (let i = 0; i < 260; i++) {
      const angle = random(TWO_PI);
      const radius = Math.pow(random(), 0.62) * width * 0.48;
      this.dust.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius * 0.9,
        size: random(0.5, 2.1),
        hue: random([190, 260, 310, 44]),
        phase: random(TWO_PI),
      });
    }
  }

  draw(playhead, energy) {
    this.fadeTrail();
    image(this.bgLayer, 0, 0);
    image(this.trailLayer, 0, 0);
    this.drawHalo(playhead, energy);

    blendMode(ADD);
    this.updateBeatMarks();
    this.updateRings();
    this.updateChordBlooms();
    this.updateEdges();
    this.updateNeurons();
    this.updateSparks();
    this.drawClock(playhead, energy);
    blendMode(BLEND);
  }

  fadeTrail() {
    this.trailLayer.push();
    this.trailLayer.blendMode(BLEND);
    this.trailLayer.noStroke();
    this.trailLayer.fill(226, 48, 3, 9);
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

    const pos = this.noteToPoint(ev);
    const node = new NeuralNode(pos.x, pos.y, ev, track);
    this.neurons.push(node);

    if (ev.track === 'lead') this.triggerLead(node, ev, track);
    else if (ev.track === 'harmony') this.triggerHarmony(node, ev, track);
    else if (ev.track === 'bass') this.triggerBass(node, ev, track);
    else if (ev.track === 'shimmer') this.triggerShimmer(node, ev, track);

    this.spawnParticles(pos.x, pos.y, track.hue, ev.velocity, ev.track);
    this.trim();
  }

  triggerPulse(ev, track) {
    const angle = scoreAngle(ev.beat);
    this.beatMarks.push(new NeuralBeatMark(angle, ev, track));
    if (ev.drum === 'kick') {
      this.rings.push(new NeuralRing(width * 0.5, height * 0.5, width * (0.045 + ev.velocity * 0.038), track.hue, ev.velocity));
      this.spawnParticles(width * 0.5, height * 0.5, track.hue, ev.velocity, ev.track);
    } else if (ev.drum === 'snare') {
      const p = orbitPoint(angle, width * 0.43);
      this.rings.push(new NeuralRing(p.x, p.y, width * 0.02, 322, ev.velocity * 0.72));
    }
  }

  triggerLead(node, ev, track) {
    if (this.lastLeadNode && this.lastLeadNode.life > 0.08) {
      const edge = new NeuralEdge(this.lastLeadNode, node, ev, track, 'melody');
      this.edges.push(edge);
      this.sparks.push(new NeuralSignalSpark(edge, ev.velocity, track.hue));
    }

    const harmonyNode = this.nearestHarmonyNode(node, ev.beat);
    if (harmonyNode) this.edges.push(new NeuralEdge(harmonyNode, node, ev, track, 'relation'));
    this.lastLeadNode = node;
  }

  triggerHarmony(node, ev, track) {
    let bloom = this.chordGroups.get(ev.groupId);
    if (!bloom) {
      bloom = new NeuralChordBloom(ev, track);
      this.chordGroups.set(ev.groupId, bloom);
      this.chordBlooms.push(bloom);
    }

    bloom.add(node);
    if (bloom.nodes.length > 1) {
      this.edges.push(new NeuralEdge(bloom.nodes[bloom.nodes.length - 2], node, ev, track, 'chord'));
    }
  }

  triggerBass(node, ev, track) {
    this.rings.push(new NeuralRing(node.x, node.y, width * 0.032, track.hue, ev.velocity * 0.72));
    if (this.lastBassNode && this.lastBassNode.life > 0.08) {
      this.edges.push(new NeuralEdge(this.lastBassNode, node, ev, track, 'bass'));
    }

    const center = new NeuralAnchorNode(width * 0.5, height * 0.5, ev.note, ev.beat);
    this.edges.push(new NeuralEdge(center, node, ev, track, 'bass-root'));
    this.lastBassNode = node;
  }

  triggerShimmer(node, ev, track) {
    const bloom = this.latestChordBloom(ev.beat);
    if (bloom) this.edges.push(new NeuralEdge(bloom.centerNode(), node, ev, track, 'shimmer'));
  }

  noteToPoint(ev) {
    const track = TRACKS[ev.track];
    const pitch = pitchNorm(ev.note);
    const pitchClass = ev.note % 12;
    const angle = scoreAngle(ev.beat) + (pitchClass - 6) * 0.006;
    const lane = track.lane;
    const radiusNorm = lane[0] + pitch * (lane[1] - lane[0]);
    const jitter = (hash01(ev.note * 47 + ev.beat * 31 + ev.trackIndex * 17) - 0.5) * width * 0.01;
    return orbitPoint(angle, width * radiusNorm + jitter);
  }

  nearestHarmonyNode(node, beat) {
    let best = null;
    let bestScore = Infinity;
    for (const bloom of this.chordBlooms) {
      const beatDistance = Math.abs(bloom.beat - beat);
      if (beatDistance > 4.1 || bloom.life <= 0.08) continue;
      for (const other of bloom.nodes) {
        const score = beatDistance * 80 + Math.abs(other.pitch - node.pitch) * 14 + dist(other.x, other.y, node.x, node.y);
        if (score < bestScore) {
          bestScore = score;
          best = other;
        }
      }
    }
    return best;
  }

  latestChordBloom(beat) {
    let best = null;
    let bestDistance = Infinity;
    for (const bloom of this.chordBlooms) {
      const d = Math.abs(beat - bloom.beat);
      if (d < bestDistance && d <= 4.2 && bloom.life > 0.1) {
        best = bloom;
        bestDistance = d;
      }
    }
    return best;
  }

  spawnParticles(x, y, hue, velocity, trackName) {
    const count = trackName === 'pulse' ? 18 : Math.floor(6 + velocity * 18);
    for (let i = 0; i < count; i++) {
      const angle = random(TWO_PI);
      const speed = random(0.7, trackName === 'pulse' ? 5.8 : 3.4) * (0.5 + velocity);
      this.sparks.push(new NeuralFreeSpark(x, y, angle, speed, hue, velocity));
    }
  }

  drawHalo(playhead, energy) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const pulse = 0.5 + 0.5 * Math.sin(playhead * 2.8);

    noStroke();
    for (const star of this.dust) {
      const twinkle = 0.35 + 0.65 * Math.sin(frameCount * 0.025 + star.phase);
      fill(star.hue, 34, 92, 9 + twinkle * 24 + energy * 12);
      circle(star.x, star.y, star.size * (0.6 + twinkle));
    }

    noFill();
    stroke(202, 32, 92, 8 + energy * 22);
    strokeWeight(1);
    circle(cx, cy, width * (0.18 + pulse * 0.012 + energy * 0.03));
    stroke(286, 46, 96, 5 + energy * 18);
    circle(cx, cy, width * (0.34 + energy * 0.035));
  }

  drawClock(playhead, energy) {
    const r = width * 0.485;
    const p = orbitPoint(scoreAngle(playhead / SCORE.beatSecond), r);
    noFill();
    stroke(190, 36, 86, 10);
    strokeWeight(1);
    circle(width * 0.5, height * 0.5, r * 2);
    fill(190 + energy * 90, 58, 100, 36 + energy * 38);
    noStroke();
    circle(p.x, p.y, 3.8 + energy * 8);
  }

  updateNeurons() {
    noStroke();
    for (let i = this.neurons.length - 1; i >= 0; i--) {
      const node = this.neurons[i];
      node.update();
      node.display();
      if (node.dead()) this.neurons.splice(i, 1);
    }
  }

  updateEdges() {
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    for (let i = this.edges.length - 1; i >= 0; i--) {
      const edge = this.edges[i];
      edge.update();
      edge.display();
      edge.paintTrail(this.trailLayer);
      if (edge.dead()) this.edges.splice(i, 1);
    }
  }

  updateRings() {
    noFill();
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.update();
      ring.display();
      if (ring.dead()) this.rings.splice(i, 1);
    }
  }

  updateChordBlooms() {
    for (let i = this.chordBlooms.length - 1; i >= 0; i--) {
      const bloom = this.chordBlooms[i];
      bloom.update();
      bloom.display();
      bloom.paintTrail(this.trailLayer);
      if (bloom.dead()) {
        this.chordGroups.delete(bloom.groupId);
        this.chordBlooms.splice(i, 1);
      }
    }
  }

  updateBeatMarks() {
    for (let i = this.beatMarks.length - 1; i >= 0; i--) {
      const mark = this.beatMarks[i];
      mark.update();
      mark.display();
      mark.paintTrail(this.trailLayer);
      if (mark.dead()) this.beatMarks.splice(i, 1);
    }
  }

  updateSparks() {
    noStroke();
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spark = this.sparks[i];
      spark.update();
      spark.display();
      spark.paintTrail(this.trailLayer);
      if (spark.dead()) this.sparks.splice(i, 1);
    }
  }

  trim() {
    if (this.neurons.length > 180) this.neurons.splice(0, this.neurons.length - 180);
    if (this.edges.length > 360) this.edges.splice(0, this.edges.length - 360);
    if (this.sparks.length > 520) this.sparks.splice(0, this.sparks.length - 520);
    if (this.beatMarks.length > 96) this.beatMarks.splice(0, this.beatMarks.length - 96);
    while (this.chordBlooms.length > 14) {
      const bloom = this.chordBlooms.shift();
      this.chordGroups.delete(bloom.groupId);
    }
  }
};

class NeuralNode {
  constructor(x, y, ev, track) {
    this.x = x;
    this.y = y;
    this.pitch = ev.note;
    this.beat = ev.beat;
    this.hue = (track.hue + ev.note * 1.7) % 360;
    this.energy = ev.velocity;
    this.radius = map(ev.velocity, 0.2, 1, 3.2, 10.5);
    this.life = 1;
    this.decay = ev.track === 'harmony' ? 0.006 : 0.009;
    this.phase = random(TWO_PI);
  }

  update() {
    this.life -= this.decay;
    this.phase += 0.025;
  }

  display() {
    const breath = 0.72 + 0.28 * Math.sin(this.phase);
    const core = this.radius * breath * (0.8 + this.energy * 0.45);
    fill(this.hue, 44, 100, 10 * this.life);
    circle(this.x, this.y, core * 6.2);
    fill(this.hue, 70, 100, 34 * this.life);
    circle(this.x, this.y, core * 2.6);
    fill((this.hue + 38) % 360, 18, 100, 82 * this.life);
    circle(this.x, this.y, core);
  }

  dead() {
    return this.life <= 0;
  }
}

class NeuralAnchorNode {
  constructor(x, y, pitch, beat) {
    this.x = x;
    this.y = y;
    this.pitch = pitch;
    this.beat = beat;
    this.life = 1;
  }
}

class NeuralChordBloom {
  constructor(ev, track) {
    this.groupId = ev.groupId;
    this.beat = ev.beat;
    this.chordName = ev.chordName;
    this.hue = (track.hue + (ev.chordRoot || ev.note) * 1.2) % 360;
    this.nodes = [];
    this.life = 1;
    this.angle = scoreAngle(ev.beat);
    const p = orbitPoint(this.angle, width * 0.29);
    this.x = p.x;
    this.y = p.y;
  }

  add(node) {
    this.nodes.push(node);
    this.life = Math.min(1, this.life + 0.12);
  }

  update() {
    this.life -= 0.0038;
  }

  display() {
    if (this.nodes.length < 2) return;
    const glow = 0.62 + 0.38 * Math.sin(frameCount * 0.035 + this.beat);
    noFill();
    stroke(this.hue, 64, 100, 7 * this.life);
    strokeWeight(12 * glow);
    beginShape();
    for (const node of this.nodes) vertex(node.x, node.y);
    endShape(CLOSE);

    stroke((this.hue + 36) % 360, 42, 100, 26 * this.life);
    strokeWeight(1.1 + glow);
    beginShape();
    for (const node of this.nodes) vertex(node.x, node.y);
    endShape(CLOSE);

    for (const node of this.nodes) {
      stroke(this.hue, 52, 100, 12 * this.life);
      strokeWeight(0.8);
      line(this.x, this.y, node.x, node.y);
    }

    fill(this.hue, 38, 100, 18 * this.life);
    noStroke();
    circle(this.x, this.y, width * 0.018 + glow * width * 0.008);
  }

  paintTrail(buffer) {
    if (this.nodes.length < 2) return;
    buffer.noFill();
    buffer.stroke(this.hue, 58, 100, 8 * this.life);
    buffer.strokeWeight(0.75);
    buffer.beginShape();
    for (const node of this.nodes) buffer.vertex(node.x, node.y);
    buffer.endShape(CLOSE);
  }

  centerNode() {
    return new NeuralAnchorNode(this.x, this.y, 60, this.beat);
  }

  dead() {
    return this.life <= 0;
  }
}

class NeuralBeatMark {
  constructor(angle, ev, track) {
    this.angle = angle;
    this.hue = ev.drum === 'kick' ? track.hue : ev.drum === 'snare' ? 322 : 196;
    this.energy = ev.velocity;
    this.drum = ev.drum;
    this.life = 1;
    this.inner = ev.drum === 'hat' ? width * 0.44 : width * 0.08;
    this.outer = width * (ev.drum === 'kick' ? 0.49 : 0.465);
  }

  update() {
    this.life -= this.drum === 'hat' ? 0.09 : 0.042;
  }

  display() {
    const p1 = orbitPoint(this.angle, this.inner);
    const p2 = orbitPoint(this.angle, this.outer);
    stroke(this.hue, 70, 100, (this.drum === 'hat' ? 28 : 42) * this.life);
    strokeWeight(this.drum === 'kick' ? 2.8 + this.energy * 3 : 1.1 + this.energy * 1.4);
    line(p1.x, p1.y, p2.x, p2.y);

    if (this.drum !== 'hat') {
      noFill();
      stroke(this.hue, 42, 100, 11 * this.life);
      strokeWeight(8 * this.energy);
      circle(p2.x, p2.y, width * (0.014 + this.energy * 0.014));
    }
  }

  paintTrail(buffer) {
    const p = orbitPoint(this.angle, this.outer);
    buffer.noStroke();
    buffer.fill(this.hue, 66, 100, 18 * this.life);
    buffer.circle(p.x, p.y, this.drum === 'hat' ? 2.2 : 4.5 + this.energy * 4);
  }

  dead() {
    return this.life <= 0;
  }
}

class NeuralEdge {
  constructor(a, b, ev, track, kind = 'signal') {
    this.ax = a.x;
    this.ay = a.y;
    this.bx = b.x;
    this.by = b.y;
    this.kind = kind;
    this.hue = (track.hue + ev.note * 0.9) % 360;
    this.weight = 0.45 + ev.velocity * (kind === 'bass-root' ? 2.7 : kind === 'melody' ? 2.1 : 1.4);
    this.life = 1;
    this.decay = kind === 'bass-root' ? 0.012 : ev.track === 'harmony' ? 0.006 : 0.01;
    this.phase = random(TWO_PI);
    const dx = this.bx - this.ax;
    const dy = this.by - this.ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bendScale = kind === 'melody' ? 0.13 : kind === 'bass-root' ? 0.04 : 0.18;
    const bend = len * random(-bendScale, bendScale);
    this.cx = lerp(this.ax, this.bx, 0.35) + nx * bend;
    this.cy = lerp(this.ay, this.by, 0.35) + ny * bend;
    this.cx2 = lerp(this.ax, this.bx, 0.7) - nx * bend * 0.42;
    this.cy2 = lerp(this.ay, this.by, 0.7) - ny * bend * 0.42;
  }

  update() {
    this.life -= this.decay;
    this.phase += 0.035;
  }

  display() {
    const shimmer = 0.65 + 0.35 * Math.sin(this.phase + frameCount * 0.03);
    stroke(this.hue, 72, 100, 9 * this.life);
    strokeWeight(this.weight * 4.6);
    bezier(this.ax, this.ay, this.cx, this.cy, this.cx2, this.cy2, this.bx, this.by);
    stroke((this.hue + 22) % 360, 48, 100, (28 + shimmer * 28) * this.life);
    strokeWeight(this.weight * shimmer);
    bezier(this.ax, this.ay, this.cx, this.cy, this.cx2, this.cy2, this.bx, this.by);

    const u = (this.phase * 0.19) % 1;
    const p = cubicAt(this, easeInOutCubic(u));
    noStroke();
    fill((this.hue + 64) % 360, 36, 100, 52 * this.life);
    circle(p.x, p.y, 2.8 + this.weight * 1.2);
  }

  paintTrail(buffer) {
    const p = cubicAt(this, (this.phase * 0.13 + 0.27) % 1);
    buffer.noStroke();
    buffer.fill(this.hue, 64, 100, 16 * this.life);
    buffer.circle(p.x, p.y, this.weight * 2.2);
  }

  dead() {
    return this.life <= 0;
  }
}

class NeuralRing {
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
    this.life -= 0.025;
  }

  display() {
    stroke(this.hue, 78, 100, 24 * this.life);
    strokeWeight(1 + this.energy * 3.6);
    circle(this.x, this.y, this.radius * 2);
    stroke((this.hue + 42) % 360, 34, 100, 10 * this.life);
    strokeWeight(7 + this.energy * 9);
    circle(this.x, this.y, this.radius * 2.04);
  }

  dead() {
    return this.life <= 0;
  }
}

class NeuralSignalSpark {
  constructor(edge, energy, hue) {
    this.edge = edge;
    this.t = 0;
    this.speed = random(0.018, 0.04) * (0.65 + energy);
    this.hue = hue;
    this.life = 1;
  }

  update() {
    this.t += this.speed;
    this.life -= 0.012;
  }

  display() {
    const p = cubicAt(this.edge, easeInOutCubic(Math.min(1, this.t)));
    fill((this.hue + 48) % 360, 38, 100, 70 * this.life);
    circle(p.x, p.y, 3.4 + 3 * this.life);
  }

  paintTrail(buffer) {
    const p = cubicAt(this.edge, Math.min(1, this.t));
    buffer.noStroke();
    buffer.fill(this.hue, 62, 100, 26 * this.life);
    buffer.circle(p.x, p.y, 3);
  }

  dead() {
    return this.life <= 0 || this.t >= 1.04;
  }
}

class NeuralFreeSpark {
  constructor(x, y, angle, speed, hue, energy) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.hue = hue;
    this.energy = energy;
    this.life = 1;
    this.decay = random(0.014, 0.03);
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    const drift = curl(this.x * 0.006, this.y * 0.006, frameCount * 0.006);
    this.vx += drift.x * 0.028;
    this.vy += drift.y * 0.028;
    this.vx *= 0.975;
    this.vy *= 0.975;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  display() {
    fill((this.hue + 18) % 360, 54, 100, 42 * this.life);
    circle(this.x, this.y, 1.4 + this.energy * 2.5);
  }

  paintTrail(buffer) {
    buffer.stroke(this.hue, 70, 100, 16 * this.life);
    buffer.strokeWeight(0.55 + this.energy * 0.85);
    buffer.line(this.px, this.py, this.x, this.y);
  }

  dead() {
    return this.life <= 0 || this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20;
  }
}
