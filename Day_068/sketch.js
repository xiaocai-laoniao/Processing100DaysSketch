const CONFIG = {
  seed: 68091,
};

const TRACKS = {
  lead: { hue: 188, channel: 0, wave: 'triangle', label: 'lead', lane: [0.36, 0.47] },
  harmony: { hue: 274, channel: 1, wave: 'sine', label: 'harmony', lane: [0.24, 0.36] },
  bass: { hue: 42, channel: 2, wave: 'sawtooth', label: 'bass', lane: [0.13, 0.22] },
  pulse: { hue: 12, channel: 9, wave: 'square', label: 'pulse', lane: [0.48, 0.5] },
  shimmer: { hue: 318, channel: 3, wave: 'sine', label: 'shimmer', lane: [0.43, 0.49] },
};

const SCENES = {
  jellyfish: { label: '音符水母群', status: 'Note jellyfish swarm' },
  neural: { label: '星图神经元', status: 'Astral neural score' },
  storm: { label: '谱面风暴', status: 'Score storm' },
  architecture: { label: '节拍建筑', status: 'Beat architecture' },
};

const SCORE_PRESETS = {
  tidal: { label: '潮汐', slug: 'tidal', bpm: 108, beats: 32 },
  stellar: { label: '星群', slug: 'stellar', bpm: 126, beats: 32 },
  pulse: { label: '脉冲', slug: 'pulse', bpm: 96, beats: 32 },
};

let fieldSize = 900;
let scenes = {};
let activeSceneId = 'jellyfish';
let activeScene = null;
let activeScoreId = 'tidal';
let SCORE = buildScore(activeScoreId);
let eventCursor = 0;
let lastPlayhead = 0;
let previewStartedAt = 0;
let isPlaying = false;
let audioCtx = null;
let masterGain = null;
let delayNode = null;
let feedbackGain = null;
let audioStartedAt = 0;
let ui = {};

function setup() {
  pixelDensity(1);
  const host = document.getElementById('canvas-wrap');
  fieldSize = Math.floor(Math.min(host.clientWidth, host.clientHeight));
  const canvas = createCanvas(fieldSize, fieldSize);
  canvas.parent('canvas-wrap');
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(60);

  randomSeed(CONFIG.seed);
  noiseSeed(CONFIG.seed);
  scenes = {
    jellyfish: new window.JellyfishScene(),
    neural: new window.NeuralScene(),
    storm: new window.ScoreStormScene(),
    architecture: new window.BeatArchitectureScene(),
  };

  wireControls();
  switchScene('jellyfish', { restartScore: false });
  updateScoreButtons();
  restartScore();
}

function draw() {
  if (!activeScene) return;
  const playhead = getPlayhead();
  processScore(playhead);
  activeScene.draw(playhead, currentEnergy(playhead));
}

function processScore(playhead) {
  if (playhead < lastPlayhead) {
    eventCursor = 0;
    activeScene.onLoop?.();
  }

  while (eventCursor < SCORE.events.length && SCORE.events[eventCursor].time <= playhead) {
    const ev = SCORE.events[eventCursor];
    activeScene.handleEvent(ev);
    if (isPlaying) playSynthEvent(ev);
    eventCursor++;
  }

  lastPlayhead = playhead;
}

function switchScene(sceneId, options = {}) {
  if (!scenes[sceneId]) return;
  activeSceneId = sceneId;
  activeScene = scenes[sceneId];
  activeScene.rebuild();
  resetScoreCursor();

  if (options.restartScore !== false) restartScore();
  updateSceneButtons();
  updateStatus();
}

function restartScore() {
  if (isPlaying && audioCtx) {
    audioStartedAt = audioCtx.currentTime;
  }
  previewStartedAt = millis();
  resetScoreCursor();
  activeScene?.onRestart?.();
}

function resetScoreCursor() {
  eventCursor = 0;
  lastPlayhead = 0;
}

function getPlayhead() {
  if (isPlaying && audioCtx) {
    return (audioCtx.currentTime - audioStartedAt) % SCORE.duration;
  }
  return ((millis() - previewStartedAt) * 0.001 * 0.86) % SCORE.duration;
}

function currentEnergy(playhead) {
  let energy = 0;
  for (const ev of SCORE.events) {
    const d = circularTimeDistance(playhead, ev.time, SCORE.duration);
    if (d < 0.42) energy += (1 - d / 0.42) * ev.velocity * (ev.track === 'pulse' ? 1.35 : 0.7);
  }
  return Math.min(1, energy * 0.18);
}

function circularTimeDistance(a, b, period) {
  const d = Math.abs(a - b);
  return Math.min(d, period - d);
}

function buildScore(scoreId = activeScoreId) {
  const preset = SCORE_PRESETS[scoreId] || SCORE_PRESETS.tidal;
  const bpm = preset.bpm;
  const totalBeats = preset.beats;
  const beatSecond = 60 / bpm;
  const events = [];
  let order = 0;

  function add(track, beat, beats, note, velocity, meta = {}) {
    events.push({
      track,
      trackIndex: Object.keys(TRACKS).indexOf(track),
      beat,
      time: beat * beatSecond,
      duration: beats * beatSecond,
      note,
      velocity,
      order: order++,
      ...meta,
    });
  }

  if (scoreId === 'stellar') buildStellarScore(add);
  else if (scoreId === 'pulse') buildPulseScore(add);
  else buildTidalScore(add);

  events.sort((a, b) => a.time - b.time || b.velocity - a.velocity || a.order - b.order);
  return {
    id: scoreId,
    label: preset.label,
    slug: preset.slug,
    bpm,
    beats: totalBeats,
    beatSecond,
    duration: totalBeats * beatSecond,
    events,
  };
}

function buildTidalScore(add) {
  const progression = [
    { name: 'Am(add9)', root: 45, chord: [57, 60, 64, 71], motif: [69, 72, 76, 79, 76, 72] },
    { name: 'Fmaj7', root: 41, chord: [53, 57, 60, 64], motif: [65, 69, 72, 76, 72, 69] },
    { name: 'Cmaj9', root: 48, chord: [55, 60, 64, 67], motif: [67, 72, 76, 79, 76, 72] },
    { name: 'Gsus4', root: 43, chord: [55, 59, 62, 67], motif: [67, 71, 74, 79, 74, 71] },
  ];

  for (let bar = 0; bar < 8; bar++) {
    const chord = progression[bar % progression.length];
    const baseBeat = bar * 4;
    const groupId = `bar-${bar}-${chord.name}`;

    for (let i = 0; i < chord.chord.length; i++) {
      add('harmony', baseBeat, 3.72, chord.chord[i], 0.46 + i * 0.045, {
        groupId,
        chordName: chord.name,
        chordRoot: chord.root,
      });
    }

    add('bass', baseBeat, 0.92, chord.root, bar % 4 === 0 ? 0.96 : 0.78, { chordName: chord.name });
    add('bass', baseBeat + 2, 0.86, chord.root + 12, 0.68, { chordName: chord.name });
    add('shimmer', baseBeat + 3.25, 0.42, chord.chord[chord.chord.length - 1] + 12, 0.36, { groupId });

    const leadBeats = [0.5, 1, 1.5, 2.5, 3, 3.5];
    for (let i = 0; i < chord.motif.length; i++) {
      const accent = i === 0 || i === 3 ? 0.9 : 0.58 + i * 0.035;
      add('lead', baseBeat + leadBeats[i], 0.34, chord.motif[i], accent, {
        chordName: chord.name,
        phraseIndex: i,
      });
    }
  }

  for (let b = 0; b < 32; b++) {
    if (b % 4 === 0 || b % 4 === 2) add('pulse', b, 0.09, 36, b % 4 === 0 ? 1 : 0.82, { drum: 'kick' });
    if (b % 4 === 1 || b % 4 === 3) add('pulse', b, 0.08, 38, 0.68, { drum: 'snare' });
    add('pulse', b + 0.5, 0.05, 42, b % 2 === 0 ? 0.35 : 0.28, { drum: 'hat' });
  }
}

function buildStellarScore(add) {
  const progression = [
    { name: 'Em9', root: 40, chord: [52, 55, 59, 66], motif: [71, 74, 78, 83, 86, 83, 78, 74] },
    { name: 'Gmaj7', root: 43, chord: [55, 59, 62, 66], motif: [74, 78, 81, 86, 90, 86, 81, 78] },
    { name: 'Bm11', root: 47, chord: [59, 62, 66, 69], motif: [73, 78, 81, 85, 90, 85, 81, 78] },
    { name: 'D6(add9)', root: 50, chord: [57, 62, 66, 71], motif: [74, 76, 81, 86, 88, 86, 81, 76] },
  ];

  for (let bar = 0; bar < 8; bar++) {
    const chord = progression[bar % progression.length];
    const baseBeat = bar * 4;
    const groupId = `stellar-${bar}-${chord.name}`;

    for (let i = 0; i < chord.chord.length; i++) {
      add('harmony', baseBeat + i * 0.08, 2.6, chord.chord[i], 0.34 + i * 0.055, {
        groupId,
        chordName: chord.name,
        chordRoot: chord.root,
      });
      add('shimmer', baseBeat + 0.75 + i * 0.5, 0.28, chord.chord[i] + 17, 0.28 + i * 0.035, { groupId });
    }

    add('bass', baseBeat, 0.52, chord.root, 0.64, { chordName: chord.name });
    add('bass', baseBeat + 1.5, 0.42, chord.root + 7, 0.48, { chordName: chord.name });
    add('bass', baseBeat + 3, 0.42, chord.root + 12, 0.54, { chordName: chord.name });

    const leadBeats = [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.62];
    for (let i = 0; i < leadBeats.length; i++) {
      add('lead', baseBeat + leadBeats[i], 0.2, chord.motif[i], i % 3 === 0 ? 0.9 : 0.5 + i * 0.04, {
        chordName: chord.name,
        phraseIndex: i,
      });
    }
  }

  for (let b = 0; b < 32; b++) {
    if (b % 4 === 0) add('pulse', b, 0.07, 36, 0.76, { drum: 'kick' });
    if (b % 4 === 2) add('pulse', b + 0.5, 0.06, 38, 0.54, { drum: 'snare' });
    add('pulse', b + 0.25, 0.04, 42, 0.24, { drum: 'hat' });
    add('pulse', b + 0.75, 0.04, 42, b % 2 === 0 ? 0.36 : 0.24, { drum: 'hat' });
  }
}

function buildPulseScore(add) {
  const progression = [
    { name: 'Dm7', root: 38, chord: [50, 53, 57, 60], motif: [62, 65, 69, 74, 69, 65] },
    { name: 'Bbmaj7', root: 34, chord: [46, 50, 53, 57], motif: [58, 62, 65, 70, 65, 62] },
    { name: 'Fadd9', root: 41, chord: [53, 57, 60, 67], motif: [60, 65, 69, 72, 69, 65] },
    { name: 'Csus2', root: 36, chord: [48, 55, 60, 62], motif: [60, 62, 67, 72, 67, 62] },
  ];

  for (let bar = 0; bar < 8; bar++) {
    const chord = progression[bar % progression.length];
    const baseBeat = bar * 4;
    const groupId = `pulse-${bar}-${chord.name}`;

    add('bass', baseBeat, 1.38, chord.root, 1, { chordName: chord.name });
    add('bass', baseBeat + 2, 1.1, chord.root + 12, 0.72, { chordName: chord.name });

    for (let i = 0; i < chord.chord.length; i++) {
      add('harmony', baseBeat + 0.05 * i, 3.45, chord.chord[i], 0.32 + i * 0.04, {
        groupId,
        chordName: chord.name,
        chordRoot: chord.root,
      });
    }

    const leadBeats = [0.75, 1.5, 2.75, 3.25];
    for (let i = 0; i < leadBeats.length; i++) {
      add('lead', baseBeat + leadBeats[i], 0.42, chord.motif[i], i === 0 ? 0.82 : 0.56 + i * 0.08, {
        chordName: chord.name,
        phraseIndex: i,
      });
    }

    add('shimmer', baseBeat + 3.5, 0.34, chord.chord[3] + 12, 0.3, { groupId });
  }

  for (let b = 0; b < 32; b++) {
    if (b % 4 === 0 || b % 4 === 2) add('pulse', b, 0.1, 36, b % 4 === 0 ? 1 : 0.9, { drum: 'kick' });
    if (b % 4 === 1) add('pulse', b + 0.5, 0.08, 38, 0.64, { drum: 'snare' });
    if (b % 4 === 3) add('pulse', b, 0.08, 38, 0.64, { drum: 'snare' });
    if (b % 2 === 0) add('pulse', b + 0.5, 0.05, 42, 0.28, { drum: 'hat' });
  }
}

function wireControls() {
  ui.play = document.getElementById('play-toggle');
  ui.restart = document.getElementById('restart-score');
  ui.midi = document.getElementById('download-midi');
  ui.png = document.getElementById('save-png');
  ui.status = document.getElementById('status-line');
  ui.sceneButtons = Array.from(document.querySelectorAll('.scene-switch'));
  ui.scoreButtons = Array.from(document.querySelectorAll('.score-switch'));

  ui.sceneButtons.forEach((button) => {
    button.addEventListener('click', () => switchScene(button.dataset.scene));
  });
  ui.scoreButtons.forEach((button) => {
    button.addEventListener('click', () => switchScore(button.dataset.score));
  });
  ui.play.addEventListener('click', togglePlayback);
  ui.restart.addEventListener('click', restartScore);
  ui.midi.addEventListener('click', downloadMidi);
  ui.png.addEventListener('click', saveCurrentPng);
}

function updateSceneButtons() {
  if (!ui.sceneButtons) return;
  ui.sceneButtons.forEach((button) => {
    const active = button.dataset.scene === activeSceneId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateScoreButtons() {
  if (!ui.scoreButtons) return;
  ui.scoreButtons.forEach((button) => {
    const active = button.dataset.score === activeScoreId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateStatus(message) {
  if (!ui.status) return;
  ui.status.textContent = message || `${SCENES[activeSceneId].status} · ${SCORE.label} · ${SCORE.bpm} BPM`;
}

function switchScore(scoreId) {
  if (!SCORE_PRESETS[scoreId]) return;
  activeScoreId = scoreId;
  SCORE = buildScore(activeScoreId);
  if (delayNode) delayNode.delayTime.value = SCORE.beatSecond * 0.75;
  activeScene?.rebuild();
  restartScore();
  updateScoreButtons();
  updateStatus();
}

async function togglePlayback() {
  if (!isPlaying) await startAudio();
  else stopAudio();
}

async function startAudio() {
  ensureAudio();
  await audioCtx.resume();
  isPlaying = true;
  audioStartedAt = audioCtx.currentTime;
  resetScoreCursor();
  activeScene?.onRestart?.();
  ui.play.textContent = 'Pause';
  updateStatus(`Playing · ${SCENES[activeSceneId].label} · ${SCORE.label}`);
}

function stopAudio() {
  isPlaying = false;
  ui.play.textContent = 'Play';
  updateStatus();
}

function ensureAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.62;

  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.22;

  delayNode = audioCtx.createDelay(1);
  delayNode.delayTime.value = SCORE.beatSecond * 0.75;
  feedbackGain = audioCtx.createGain();
  feedbackGain.gain.value = 0.22;

  delayNode.connect(feedbackGain);
  feedbackGain.connect(delayNode);
  delayNode.connect(compressor);
  masterGain.connect(delayNode);
  masterGain.connect(compressor);
  compressor.connect(audioCtx.destination);
}

function playSynthEvent(ev) {
  if (!audioCtx || !masterGain) return;
  if (ev.track === 'pulse') {
    if (ev.drum === 'kick') playKick(ev);
    else playNoiseHit(ev);
    return;
  }

  const track = TRACKS[ev.track];
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  const freq = midiToFreq(ev.note);

  osc.type = track.wave;
  osc.frequency.setValueAtTime(freq, now);
  if (ev.track === 'bass') {
    osc.detune.setValueAtTime(-7, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(580, now);
  } else {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.4, now);
    filter.Q.value = ev.track === 'shimmer' ? 3.8 : 2.2;
  }

  const attack = ev.track === 'harmony' ? 0.035 : 0.012;
  const sustain = Math.max(0.08, ev.duration * 0.78);
  const peak = ev.velocity * (ev.track === 'bass' ? 0.18 : 0.13);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.003, peak), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + sustain + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + sustain + 0.22);
}

function playKick(ev) {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.13);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.34 * ev.velocity, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.24);
}

function playNoiseHit(ev) {
  const now = audioCtx.currentTime;
  const duration = ev.drum === 'hat' ? 0.045 : 0.12;
  const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * duration), audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = random(-1, 1) * (1 - i / data.length);
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  source.buffer = buffer;
  filter.type = ev.drum === 'hat' ? 'highpass' : 'bandpass';
  filter.frequency.value = ev.drum === 'hat' ? 6200 : 1900;
  filter.Q.value = ev.drum === 'snare' ? 1.4 : 0.8;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime((ev.drum === 'hat' ? 0.035 : 0.09) * ev.velocity, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start(now);
}

function saveCurrentPng() {
  saveCanvas(`Day_068_${activeSceneId}_${SCORE.slug}`, 'png');
}

function downloadMidi() {
  const bytes = scoreToMidiBytes(SCORE);
  const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Day_068_${SCORE.slug}_synesthetic_score.mid`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  updateStatus(`MIDI exported · ${SCORE.label}`);
}

function scoreToMidiBytes(score) {
  const ticksPerBeat = 480;
  const bytes = [];
  const trackBytes = [];
  const tempo = Math.round(60000000 / score.bpm);

  appendAscii(bytes, 'MThd');
  appendUint32(bytes, 6);
  appendUint16(bytes, 0);
  appendUint16(bytes, 1);
  appendUint16(bytes, ticksPerBeat);

  pushVarLen(trackBytes, 0);
  trackBytes.push(0xff, 0x51, 0x03, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255);
  pushVarLen(trackBytes, 0);
  pushTextMeta(trackBytes, 0x03, `Day 068 ${score.slug}`);

  const midiEvents = [];
  for (const ev of score.events) {
    const channel = TRACKS[ev.track].channel;
    const start = Math.round(ev.beat * ticksPerBeat);
    const end = Math.round((ev.beat + ev.duration / score.beatSecond) * ticksPerBeat);
    const note = clampInt(ev.note, 0, 127);
    const velocity = clampInt(Math.round(ev.velocity * 112), 1, 127);
    midiEvents.push({ tick: start, type: 0x90 | channel, note, velocity, priority: 1 });
    midiEvents.push({ tick: end, type: 0x80 | channel, note, velocity: 0, priority: 0 });
  }

  midiEvents.sort((a, b) => a.tick - b.tick || a.priority - b.priority);
  let lastTick = 0;
  for (const ev of midiEvents) {
    pushVarLen(trackBytes, ev.tick - lastTick);
    trackBytes.push(ev.type, ev.note, ev.velocity);
    lastTick = ev.tick;
  }

  pushVarLen(trackBytes, ticksPerBeat);
  trackBytes.push(0xff, 0x2f, 0x00);

  appendAscii(bytes, 'MTrk');
  appendUint32(bytes, trackBytes.length);
  bytes.push(...trackBytes);
  return bytes;
}

function appendAscii(bytes, text) {
  for (let i = 0; i < text.length; i++) bytes.push(text.charCodeAt(i) & 255);
}

function pushTextMeta(bytes, type, text) {
  bytes.push(0xff, type);
  const ascii = text.replace(/[^\x20-\x7e]/g, '');
  pushVarLen(bytes, ascii.length);
  appendAscii(bytes, ascii);
}

function appendUint16(bytes, value) {
  bytes.push((value >> 8) & 255, value & 255);
}

function appendUint32(bytes, value) {
  bytes.push((value >> 24) & 255, (value >> 16) & 255, (value >> 8) & 255, value & 255);
}

function pushVarLen(bytes, value) {
  let buffer = value & 0x7f;
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
}

function scoreAngle(beat) {
  return -HALF_PI + ((beat % SCORE.beats) / SCORE.beats) * TWO_PI;
}

function orbitPoint(angle, radius) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius * 0.86,
  };
}

function noteTimePoint(ev, yPad = 0.18) {
  const pitch = pitchNorm(ev.note);
  return {
    x: width * (0.12 + (ev.beat / SCORE.beats) * 0.76),
    y: height * lerp(1 - yPad, yPad, pitch),
  };
}

function pitchNorm(note) {
  return constrain((note - 34) / 58, 0, 1);
}

function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function cubicAt(edge, t) {
  const inv = 1 - t;
  return {
    x: inv ** 3 * edge.ax + 3 * inv ** 2 * t * edge.cx + 3 * inv * t ** 2 * edge.cx2 + t ** 3 * edge.bx,
    y: inv ** 3 * edge.ay + 3 * inv ** 2 * t * edge.cy + 3 * inv * t ** 2 * edge.cy2 + t ** 3 * edge.by,
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
    freq *= 2.01;
  }
  return value / total;
}

function curl(x, y, z) {
  const eps = 0.001;
  const dx = noise(x + eps, y, z) - noise(x - eps, y, z);
  const dy = noise(x, y + eps, z) - noise(x, y - eps, z);
  return { x: dy / (2 * eps), y: -dx / (2 * eps) };
}

function hash01(value) {
  return fract01(Math.sin(value * 12.9898) * 43758.5453);
}

function fract01(value) {
  return value - Math.floor(value);
}

function clampInt(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, Math.floor(value)));
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function smoothStep01(x) {
  return x * x * (3 - 2 * x);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCurrentPng();
  if (key === 'm' || key === 'M') downloadMidi();
  if (key === 'r' || key === 'R') restartScore();
  if (key === '1') switchScene('jellyfish');
  if (key === '2') switchScene('neural');
  if (key === '3') switchScene('storm');
  if (key === '4') switchScene('architecture');
  if (key === 'q' || key === 'Q') switchScore('tidal');
  if (key === 'w' || key === 'W') switchScore('stellar');
  if (key === 'e' || key === 'E') switchScore('pulse');
  if (key === ' ') {
    togglePlayback();
    return false;
  }
  return true;
}

function windowResized() {
  const host = document.getElementById('canvas-wrap');
  const nextSize = Math.floor(Math.min(host.clientWidth, host.clientHeight));
  if (Math.abs(nextSize - fieldSize) > 2) {
    fieldSize = nextSize;
    resizeCanvas(fieldSize, fieldSize);
    for (const scene of Object.values(scenes)) scene.rebuild();
    restartScore();
  }
}
