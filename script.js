/**
 * ============================================================================
 * HAPPY BIRTHDAY SREOSHI ROY - MAGICAL SURPRISE WEBSITE
 * Birthday: 15 November
 * High-Performance Animation, Procedural Web Audio Engine & Canvas Effects
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Recipient & Config ---
  const CONFIG = {
    name: 'Sreoshi Roy',
    birthdayDate: '15 November',
    totalWishes: 6,
    tempoBPM: 78,
  };

  // --- State ---
  const state = {
    audioInitialized: false,
    isPlayingMusic: false,
    unlockedWishes: new Set(),
    candleBlownOut: false,
    activeSceneIndex: 0,
    micListening: false,
  };

  /* ==========================================================================
     1. PROCEDURAL WEB AUDIO SYNTHESIZER & SOUND FX
     Zero external audio dependencies - 100% reliable offline & cross-platform
     ========================================================================== */
  class BirthdayAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.isPlaying = false;
      this.currentNoteIndex = 0;
      this.sequenceTimeout = null;
      this.currentMode = 'audio'; // 'audio' (mp3) or 'synth'

      // "Happy Birthday" melody notes (Freq in Hz, duration in beats)
      // G4, G4, A4, G4, C5, B4 | G4, G4, A4, G4, D5, C5 | ...
      this.melody = [
        { f: 392.00, d: 0.75 }, // G4
        { f: 392.00, d: 0.25 }, // G4
        { f: 440.00, d: 1.00 }, // A4
        { f: 392.00, d: 1.00 }, // G4
        { f: 523.25, d: 1.00 }, // C5
        { f: 493.88, d: 2.00 }, // B4

        { f: 392.00, d: 0.75 }, // G4
        { f: 392.00, d: 0.25 }, // G4
        { f: 440.00, d: 1.00 }, // A4
        { f: 392.00, d: 1.00 }, // G4
        { f: 587.33, d: 1.00 }, // D5
        { f: 523.25, d: 2.00 }, // C5

        { f: 392.00, d: 0.75 }, // G4
        { f: 392.00, d: 0.25 }, // G4
        { f: 783.99, d: 1.00 }, // G5
        { f: 659.25, d: 1.00 }, // E5
        { f: 523.25, d: 1.00 }, // C5
        { f: 493.88, d: 1.00 }, // B4
        { f: 440.00, d: 1.50 }, // A4

        { f: 698.46, d: 0.75 }, // F5
        { f: 698.46, d: 0.25 }, // F5
        { f: 659.25, d: 1.00 }, // E5
        { f: 523.25, d: 1.00 }, // C5
        { f: 587.33, d: 1.00 }, // D5
        { f: 523.25, d: 2.50 }, // C5
      ];

      // Soft ambient backing chords
      this.chordProgression = [
        [261.63, 329.63, 392.00], // C major
        [246.94, 293.66, 392.00], // G major
        [261.63, 329.63, 392.00], // C major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66], // G major
        [261.63, 329.63, 523.25], // C major resolution
      ];
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        return;
      }
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music Bus with soft lowpass filter for warm music-box celesta feel
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

        this.musicGain.connect(this.filter);
        this.filter.connect(this.masterGain);

        // SFX Bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        state.audioInitialized = true;
      } catch (e) {
        console.warn('Web Audio API unavailable:', e);
      }
    }

    // Set Track
    setTrack(trackSrc) {
      this.stopMelodyLoop();
      const bgAudio = document.getElementById('bg-music-audio');

      if (trackSrc === 'synth') {
        this.currentMode = 'synth';
        this.startSynthMelody();
      } else {
        this.currentMode = 'audio';
        if (bgAudio) {
          bgAudio.src = trackSrc;
          bgAudio.load();
          this.startMelodyLoop();
        }
      }
    }

    // Play a single music box bell note
    playMusicBoxNote(freq, durationSec) {
      if (!this.ctx || this.ctx.state !== 'running') return;

      const now = this.ctx.currentTime;

      // Bell chime: Dual oscillators (Sine fundamental + Triangle harmonic overtone)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.002, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.4, now + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.6);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec * 1.7);
      osc2.stop(now + durationSec * 1.7);
    }

    // Play soft backing ambient pad chord
    playAmbientPad(chordNotes, durationSec) {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      chordNotes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq / 2, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + durationSec);
      });
    }

    // Start playback loop (Supports HTML5 audio file or procedural Web Audio synth)
    startMelodyLoop() {
      const bgAudio = document.getElementById('bg-music-audio');
      if (this.currentMode === 'synth' || !bgAudio || !bgAudio.getAttribute('src')) {
        this.startSynthMelody();
        return;
      }

      bgAudio.volume = 0.7;
      bgAudio.play().then(() => {
        this.isPlaying = true;
        state.isPlayingMusic = true;
        updateMusicButtonUI(true);
      }).catch((err) => {
        console.warn('Audio play error, falling back to synth:', err);
        this.startSynthMelody();
      });
    }

    startSynthMelody() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlaying = true;
      state.isPlayingMusic = true;
      this.currentNoteIndex = 0;
      this.scheduleNextNote();
      updateMusicButtonUI(true);
    }

    stopMelodyLoop() {
      const bgAudio = document.getElementById('bg-music-audio');
      if (bgAudio) {
        bgAudio.pause();
      }
      this.isPlaying = false;
      state.isPlayingMusic = false;
      if (this.sequenceTimeout) {
        clearTimeout(this.sequenceTimeout);
        this.sequenceTimeout = null;
      }
      updateMusicButtonUI(false);
    }

    scheduleNextNote() {
      if (!this.isPlaying) return;

      const beatDurationSec = 60 / CONFIG.tempoBPM;
      const note = this.melody[this.currentNoteIndex];
      const durationSec = note.d * beatDurationSec;

      // Play note
      this.playMusicBoxNote(note.f, durationSec);

      // Trigger ambient chord at key phrase beginnings
      if (this.currentNoteIndex % 6 === 0) {
        const chordIndex = Math.floor(this.currentNoteIndex / 4) % this.chordProgression.length;
        this.playAmbientPad(this.chordProgression[chordIndex], 3.8);
      }

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

      // Small pause before repeating song
      const delayMs = (durationSec) * 1000;
      this.sequenceTimeout = setTimeout(() => {
        this.scheduleNextNote();
      }, delayMs);
    }

    // --- Sound Effects ---

    // Bubble pop sound (crisp glass pop + high frequency sparkle)
    playPop() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.13);
    }

    // Magical chime / harp glissando
    playChime() {
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playMusicBoxNote(freq, 0.8);
        }, idx * 60);
      });
    }

    // Countdown beep/bell
    playCountdownBeep(isFinal) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isFinal ? 'triangle' : 'sine';
      const freq = isFinal ? 880 : 440; // A5 vs A4
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.9 : 0.35));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + (isFinal ? 1 : 0.4));
    }

    // Candle blow whoosh sound
    playWhoosh() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/soft noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(250, now + 0.65);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.7);
    }

    // Firework boom & crackle
    playFireworkBoom() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low frequency thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.5);

      // Crackle tail
      setTimeout(() => {
        this.playWhoosh();
      }, 100);
    }
  }

  const audio = new BirthdayAudioEngine();

  function updateMusicButtonUI(isPlaying) {
    const btn = document.getElementById('btn-music-toggle');
    const label = document.getElementById('music-status-text');
    if (!btn || !label) return;

    if (isPlaying) {
      btn.classList.add('playing');
      label.textContent = 'Music On ♫';
      btn.setAttribute('aria-label', 'Pause background music');
    } else {
      btn.classList.remove('playing');
      label.textContent = 'Music Paused';
      btn.setAttribute('aria-label', 'Play background music');
    }
  }

  /* ==========================================================================
     2. BACKGROUND STARFIELD & GLOW PARTICLES (Canvas)
     ========================================================================== */
  class ParticleBackground {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = window.innerWidth < 768 ? 45 : 75;
      this.width = 0;
      this.height = 0;
      this.animId = null;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      // Create glowing particles with rose gold, champagne & lilac tones
      const colors = [
        'rgba(255, 209, 220, ', // Rose gold shimmer
        'rgba(248, 173, 157, ', // Warm peach rose
        'rgba(255, 248, 219, ', // Golden starlight
        'rgba(232, 180, 184, ', // Classic rose gold
        'rgba(209, 179, 226, ', // Soft violet
      ];

      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2.2 + 0.6,
          baseAlpha: Math.random() * 0.6 + 0.25,
          alpha: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(Math.random() * 0.45 + 0.15), // Gentle drift upward
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseVal: Math.random() * Math.PI * 2,
        });
      }

      this.animate();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.25;
        p.alpha = Math.max(0.08, Math.min(0.9, p.alpha));

        // Wrap around boundaries
        if (p.y < -10) p.y = this.height + 10;
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color + p.alpha + ')';
        this.ctx.shadowBlur = p.radius * 4;
        this.ctx.shadowColor = p.color + '0.8)';
        this.ctx.fill();
      }

      this.animId = requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     3. FIREWORKS ENGINE (Canvas Finale in Scene 5)
     ========================================================================== */
  class FireworksEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.width = 0;
      this.height = 0;
      this.fireworks = [];
      this.particles = [];
      this.isRunning = false;
      this.spawnInterval = null;

      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animate();

      // Launch rocket every 450-800ms
      this.spawn();
      this.spawnInterval = setInterval(() => {
        if (!this.isRunning) return;
        this.spawn();
      }, 650);

      // Auto stop heavy fireworks after 18 seconds to preserve battery
      setTimeout(() => {
        if (this.spawnInterval) {
          clearInterval(this.spawnInterval);
          this.spawnInterval = null;
        }
      }, 18000);
    }

    stop() {
      this.isRunning = false;
      if (this.spawnInterval) {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
      }
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    spawn() {
      const startX = Math.random() * (this.width * 0.7) + this.width * 0.15;
      const targetX = startX + (Math.random() - 0.5) * 120;
      const targetY = Math.random() * (this.height * 0.45) + 60;
      const colors = [
        '#f8ad9d', '#e8b4b8', '#ffd166', '#fcd5ce', '#ffd1dc', '#c8798a', '#e29578', '#fff'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.fireworks.push({
        x: startX,
        y: this.height,
        targetX: targetX,
        targetY: targetY,
        speed: 8 + Math.random() * 4,
        angle: Math.atan2(targetY - this.height, targetX - startX),
        color: color,
        trail: [],
      });
    }

    explode(x, y, color) {
      audio.playFireworkBoom();
      const count = window.innerWidth < 768 ? 45 : 75;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 5.5 + 1.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          color: color,
          size: Math.random() * 2.8 + 1.2,
          gravity: 0.07,
          flicker: Math.random() > 0.5,
        });
      }
    }

    animate() {
      if (!this.isRunning) return;

      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalCompositeOperation = 'lighter';

      // Update Rockets
      for (let i = this.fireworks.length - 1; i >= 0; i--) {
        const fw = this.fireworks[i];
        fw.x += Math.cos(fw.angle) * fw.speed;
        fw.y += Math.sin(fw.angle) * fw.speed;

        // Draw rocket head
        this.ctx.beginPath();
        this.ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = fw.color;
        this.ctx.fill();

        // Check if reached destination
        if (fw.y <= fw.targetY) {
          this.explode(fw.x, fw.y, fw.color);
          this.fireworks.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     4. PROCEDURAL CONFETTI CANNON (Canvas fallback & Canvas-Confetti library)
     ========================================================================== */
  function fireConfettiCelebration() {
    // If external canvas-confetti loaded from CDN, use its multi-burst feature
    if (typeof confetti === 'function') {
      const colors = ['#f8ad9d', '#e8b4b8', '#ffd166', '#fcd5ce', '#ffffff', '#c97a8e'];

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: colors,
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: colors,
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: colors,
        });
      }, 450);
    } else {
      // Internal Canvas Confetti Fallback
      runInternalConfetti();
    }
  }

  function runInternalConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#f8ad9d', '#e8b4b8', '#ffd166', '#fcd5ce', '#fff', '#c97a8e'];

    for (let i = 0; i < 90; i++) {
      confettiPieces.push({
        x: canvas.width / 2,
        y: canvas.height * 0.6,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: -(Math.random() * 14 + 8),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.35,
        alpha: 1,
      });
    }

    let frames = 0;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;

      for (let p of confettiPieces) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        if (frames > 50) p.alpha -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (frames < 140) {
        requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    loop();
  }

  /* ==========================================================================
     5. FLOATING BALLOONS GENERATOR
     ========================================================================== */
  function spawnFloatingBalloons(count = 7) {
    const stream = document.getElementById('balloon-stream');
    if (!stream) return;

    const balloonPalettes = [
      'radial-gradient(circle at 35% 30%, #fff0f3, #f8ad9d)',
      'radial-gradient(circle at 35% 30%, #ffe5ec, #e8b4b8)',
      'radial-gradient(circle at 35% 30%, #fff8db, #ffd166)',
      'radial-gradient(circle at 35% 30%, #fcd5ce, #b76e79)',
      'radial-gradient(circle at 35% 30%, #f3e8ff, #a855f7)',
    ];

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'floating-balloon';

      const leftPercent = Math.random() * 88 + 6;
      const sizeMultiplier = Math.random() * 0.45 + 0.8;
      const duration = Math.random() * 7 + 14; // 14-21s
      const delay = Math.random() * 12;

      balloon.style.left = `${leftPercent}%`;
      balloon.style.width = `${36 * sizeMultiplier}px`;
      balloon.style.height = `${48 * sizeMultiplier}px`;
      balloon.style.background = balloonPalettes[i % balloonPalettes.length];
      balloon.style.animationDuration = `${duration}s`;
      balloon.style.animationDelay = `${delay}s`;

      stream.appendChild(balloon);
    }
  }

  /* ==========================================================================
     6. TYPEWRITER EFFECT (Scene 2)
     ========================================================================== */
  function runTypewriter(targetEl, text, speedMs = 38, callback = null) {
    if (!targetEl) return;
    targetEl.textContent = '';
    let index = 0;

    function typeNextChar() {
      if (index < text.length) {
        targetEl.textContent += text.charAt(index);
        index++;
        setTimeout(typeNextChar, speedMs);
      } else {
        if (typeof callback === 'function') callback();
      }
    }
    typeNextChar();
  }

  /* ==========================================================================
     7. TOAST NOTIFICATIONS
     ========================================================================== */
  function showToast(message, durationMs = 3000) {
    const toast = document.getElementById('toast-notice');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, durationMs);
  }

  /* ==========================================================================
     8. POLAROID 3D TILT MOTION & CUSTOM PHOTO UPLOADER
     ========================================================================== */
  function initPolaroidGallery() {
    const cards = document.querySelectorAll('.polaroid-card');

    cards.forEach((card, index) => {
      // Read saved custom image if user uploaded one previously
      const savedCustomImg = localStorage.getItem(`sreoshi_polaroid_${index}`);
      if (savedCustomImg) {
        const img = card.querySelector('.polaroid-img');
        if (img) img.src = savedCustomImg;
      }

      // Gentle interactive 3D perspective tilt on mouse / touch hover
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / rect.height) * 14;
        const rotateY = (x / rect.width) * 14;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });

      // Click to open Lightbox
      card.addEventListener('click', (e) => {
        // Don't trigger if clicked on an inner action button
        if (e.target.closest('.polaroid-edit-btn')) return;

        const img = card.querySelector('.polaroid-img');
        const caption = card.querySelector('.polaroid-caption');
        const subnote = card.querySelector('.polaroid-subnote');

        openPolaroidLightbox({
          imgSrc: img ? img.src : '',
          title: caption ? caption.textContent : 'Sweet Memory',
          note: subnote ? subnote.getAttribute('data-full-note') || subnote.textContent : '',
        });
      });
    });

    // Custom Photo Upload System
    const fileInput = document.getElementById('photo-file-input');
    const uploadBtn = document.getElementById('btn-upload-photo');
    const resetBtn = document.getElementById('btn-reset-photos');

    let activeCardIndexForUpload = 0;

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => {
        activeCardIndexForUpload = (activeCardIndexForUpload + 1) % cards.length;
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const targetCard = cards[activeCardIndexForUpload];
          if (targetCard) {
            const img = targetCard.querySelector('.polaroid-img');
            if (img) {
              img.src = dataUrl;
              try {
                localStorage.setItem(`sreoshi_polaroid_${activeCardIndexForUpload}`, dataUrl);
                showToast(`✨ Updated Polaroid #${activeCardIndexForUpload + 1} with your photo!`);
              } catch (err) {
                showToast(`✨ Photo updated in gallery!`);
              }
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        cards.forEach((card, idx) => {
          localStorage.removeItem(`sreoshi_polaroid_${idx}`);
          const img = card.querySelector('.polaroid-img');
          const defaultSrc = card.getAttribute('data-default-img');
          if (img && defaultSrc) img.src = defaultSrc;
        });
        showToast('✨ Restored original aesthetic artwork!');
      });
    }
  }

  function openPolaroidLightbox(data) {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const noteEl = document.getElementById('lightbox-note');

    if (!modal) return;
    if (imgEl) imgEl.src = data.imgSrc;
    if (titleEl) titleEl.textContent = data.title;
    if (noteEl) noteEl.textContent = data.note;

    modal.classList.add('active');
    audio.playPop();
  }

  /* ==========================================================================
     9. CLICKABLE WISH BUBBLES (Scene 4)
     ========================================================================== */
  const WISHES_DATA = [
    {
      id: 1,
      icon: '💖',
      title: 'Boundless Joy',
      bubbleLabel: 'Joy & Laughs',
      message: 'Dearest Sreoshi, may every single day bring you reasons to smile as radiantly as you do today. May your heart always be light, carefree, and wrapped in warm laughter!',
    },
    {
      id: 2,
      icon: '🌟',
      title: 'Dreams Come True',
      bubbleLabel: 'Secret Dreams',
      message: 'May every quiet aspiration, late-night wish, and bold dream you hold close to your heart find its wings this year. You possess the brilliance to achieve anything you set your mind to.',
    },
    {
      id: 3,
      icon: '🕊️',
      title: 'Peace & Serenity',
      bubbleLabel: 'Inner Peace',
      message: 'May life treat you with gentle kindness. In every storm, may you find tranquility; in every quiet moment, may you feel confident, loved, and at peace with how wonderful you are.',
    },
    {
      id: 4,
      icon: '🌸',
      title: 'Everlasting Glow',
      bubbleLabel: 'Eternal Radiance',
      message: 'Never lose that enchanting sparkle in your eyes and that genuine kindness that lights up any room you walk into. Your soul has a glow that is truly one of a kind.',
    },
    {
      id: 5,
      icon: '🚀',
      title: 'Limitless Success',
      bubbleLabel: 'Bright Future',
      message: 'Here is to groundbreaking milestones, new adventures, and doors opening wide for you. May your hard work always bear the sweetest fruits and lead to extraordinary achievements.',
    },
    {
      id: 6,
      icon: '🍫',
      title: 'Pure Sweet Moments',
      bubbleLabel: 'Sweet Blessings',
      message: 'May this year be sweetened with cozy cups of coffee, unforgettable road trips, heartfelt hugs, sweet treats, and conversations that make your soul sing with delight!',
    },
  ];

  function initWishBubbles() {
    const bubbles = document.querySelectorAll('.wish-bubble');
    const countBadge = document.getElementById('wish-counter-text');

    bubbles.forEach((bubble) => {
      bubble.addEventListener('click', () => {
        const wishId = parseInt(bubble.getAttribute('data-wish-id'), 10);
        const wish = WISHES_DATA.find((w) => w.id === wishId);
        if (!wish) return;

        // Pop sound & visual
        audio.playPop();
        bubble.classList.add('popped');
        state.unlockedWishes.add(wishId);

        // Update Counter
        if (countBadge) {
          countBadge.textContent = `${state.unlockedWishes.size} / ${CONFIG.totalWishes} Collected ✨`;
        }

        // Open Wish Modal
        openWishModal(wish);

        // Check if all unlocked
        if (state.unlockedWishes.size === CONFIG.totalWishes) {
          setTimeout(() => {
            fireConfettiCelebration();
            showToast('🎉 All 6 magical birthday wishes unlocked for Sreoshi!');
          }, 600);
        }
      });
    });
  }

  function openWishModal(wish) {
    const modal = document.getElementById('wish-modal');
    const iconEl = document.getElementById('wish-modal-icon');
    const titleEl = document.getElementById('wish-modal-title');
    const bodyEl = document.getElementById('wish-modal-body');

    if (!modal) return;
    if (iconEl) iconEl.textContent = wish.icon;
    if (titleEl) titleEl.textContent = wish.title;
    if (bodyEl) bodyEl.textContent = wish.message;

    modal.classList.add('active');
  }

  /* ==========================================================================
     10. MAKE-A-WISH CANDLE, FIREWORKS & CLOSING MESSAGE (Scene 5)
     ========================================================================== */
  function initCandleAndFireworks(fireworksEngine) {
    const candleStage = document.getElementById('candle-stage');
    const flame = document.getElementById('candle-flame');
    const blowBtn = document.getElementById('btn-blow-candle');
    const closingCard = document.getElementById('closing-card');
    const replayBtn = document.getElementById('btn-replay-all');
    const shareBtn = document.getElementById('btn-share-link');
    const micBtn = document.getElementById('btn-mic-blow');

    function blowOutCandle() {
      if (state.candleBlownOut) return;
      state.candleBlownOut = true;

      // Audio whoosh
      audio.playWhoosh();

      // Visual candle extinguishing
      candleStage.classList.add('blown-out');

      // Update Blow button text
      if (blowBtn) {
        blowBtn.innerHTML = '✨ Wish Made! ✨';
        blowBtn.disabled = true;
        blowBtn.style.opacity = '0.7';
      }

      // Celebratory Confetti & Fireworks
      setTimeout(() => {
        fireConfettiCelebration();
        fireworksEngine.start();
        audio.playChime();
      }, 500);

      // Unfurl Closing Message Card
      setTimeout(() => {
        if (closingCard) {
          closingCard.classList.add('visible');
          closingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    }

    if (flame) {
      flame.addEventListener('click', blowOutCandle);
    }

    if (blowBtn) {
      blowBtn.addEventListener('click', blowOutCandle);
    }

    // Microphone blow detection feature
    if (micBtn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      micBtn.addEventListener('click', async () => {
        if (state.candleBlownOut) return;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          const microphone = audioCtx.createMediaStreamSource(stream);
          analyser.fftSize = 256;
          microphone.connect(analyser);

          showToast('🎙️ Microphone ready! Blow gently into your phone mic!');
          micBtn.innerHTML = '💨 Listening... Blow now!';

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          function checkBlow() {
            if (state.candleBlownOut) {
              stream.getTracks().forEach((track) => track.stop());
              return;
            }
            analyser.getByteFrequencyData(dataArray);

            // Compute energy in low-frequency range (blow sound)
            let sum = 0;
            for (let i = 0; i < 20; i++) {
              sum += dataArray[i];
            }
            const average = sum / 20;

            if (average > 65) {
              // Detected puff/blow!
              blowOutCandle();
              stream.getTracks().forEach((track) => track.stop());
              return;
            }
            requestAnimationFrame(checkBlow);
          }
          checkBlow();
        } catch (err) {
          showToast('Microphone not enabled - use the "Blow Out Candle" button!');
        }
      });
    }

    // Replay Experience
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        state.candleBlownOut = false;
        candleStage.classList.remove('blown-out');
        if (blowBtn) {
          blowBtn.innerHTML = 'Blow Out the Candle 🎂';
          blowBtn.disabled = false;
          blowBtn.style.opacity = '1';
        }
        if (closingCard) {
          closingCard.classList.remove('visible');
        }
        fireworksEngine.stop();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('✨ Replaying the magic for Sreoshi!');
      });
    }

    // Share link button
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const shareData = {
          title: `Happy Birthday Sreoshi Roy! ✨`,
          text: `Wishing Sreoshi Roy the most magical, breathtaking birthday on 15 November! Check out this special surprise:`,
          url: window.location.href,
        };

        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          showToast('💖 Birthday surprise link copied to clipboard!');
        }
      });
    }
  }

  /* ==========================================================================
     11. INTRO GIFT UNBOXING TIMELINE & 3-2-1 COUNTDOWN
     ========================================================================== */
  function initIntroAndCountdown() {
    const openBtn = document.getElementById('btn-open-gift');
    const giftBox = document.getElementById('gift-box-3d');
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNum = document.getElementById('countdown-number');
    const countdownTagline = document.getElementById('countdown-tagline');
    const revealCard = document.getElementById('reveal-card');
    const typewriterEl = document.getElementById('typewriter-text');

    if (!openBtn || !giftBox) return;

    openBtn.addEventListener('click', () => {
      // Initialize audio on user interaction
      audio.init();
      audio.startMelodyLoop();
      audio.playChime();

      // Box animation
      giftBox.classList.add('opening');
      openBtn.style.pointerEvents = 'none';
      openBtn.style.opacity = '0.5';

      // GSAP / Fallback animation for gift box burst
      if (typeof gsap !== 'undefined') {
        gsap.to(openBtn, { opacity: 0, y: 20, duration: 0.5 });
      }

      // Start Countdown sequence
      setTimeout(() => {
        startCountdownSequence();
      }, 750);
    });

    function startCountdownSequence() {
      if (!countdownOverlay || !countdownNum) return;
      countdownOverlay.classList.add('active');

      const numbers = [3, 2, 1];
      let step = 0;

      function showStep() {
        if (step < numbers.length) {
          const num = numbers[step];
          countdownNum.textContent = num;
          audio.playCountdownBeep(false);

          if (typeof gsap !== 'undefined') {
            gsap.fromTo(
              countdownNum,
              { scale: 0.4, opacity: 0 },
              { scale: 1.15, opacity: 1, duration: 0.45, ease: 'back.out(2)' }
            );
          } else {
            countdownNum.style.transform = 'scale(1)';
            countdownNum.style.opacity = '1';
          }

          step++;
          setTimeout(showStep, 950);
        } else {
          // Final 0 -> Reveal!
          countdownNum.textContent = '🎉';
          countdownTagline.textContent = 'Happy Birthday Sreoshi!';
          countdownTagline.style.opacity = '1';
          audio.playCountdownBeep(true);
          fireConfettiCelebration();

          setTimeout(() => {
            // Dismiss countdown overlay
            countdownOverlay.classList.remove('active');

            // Smooth scroll to Scene 2
            const scene2 = document.getElementById('scene-countdown');
            if (scene2) {
              scene2.scrollIntoView({ behavior: 'smooth' });
            }

            // Trigger Typewriter text
            if (!state.typewriterRan) {
              state.typewriterRan = true;
              const typewriterMessage =
                'Born on the 15th of November ✨ Today, the entire universe aligns to celebrate the most radiant, wonderful soul in the world. May your life be filled with boundless laughter, deepest love, and pure magic!';
              runTypewriter(typewriterEl, typewriterMessage, 32);
            }

            // Spawn balloons
            spawnFloatingBalloons(8);
          }, 900);
        }
      }

      showStep();
    }
  }

  /* ==========================================================================
     12. NAVIGATION DOCK & SCROLL SPY
     ========================================================================== */
  function initNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    const scenes = document.querySelectorAll('.scene');

    // Scroll to scene on dot click
    navDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetScene = document.getElementById(targetId);
        if (targetScene) {
          targetScene.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Scroll buttons
    const scrollDownBtn = document.getElementById('btn-scroll-to-gallery');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', () => {
        const gallery = document.getElementById('scene-gallery');
        if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Scroll Spy using IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              if (id === 'scene-countdown' && !state.typewriterRan) {
                state.typewriterRan = true;
                const typewriterEl = document.getElementById('typewriter-text');
                const typewriterMessage =
                  'Born on the 15th of November ✨ Today, the entire universe aligns to celebrate the most radiant, wonderful soul in the world. May your life be filled with boundless laughter, deepest love, and pure magic!';
                runTypewriter(typewriterEl, typewriterMessage, 32);
              }

              navDots.forEach((dot) => {
                if (dot.getAttribute('data-target') === id) {
                  dot.classList.add('active');
                } else {
                  dot.classList.remove('active');
                }
              });
            }
          });
        },
        { threshold: 0.4 }
      );

      scenes.forEach((scene) => observer.observe(scene));
    }

    // Modal Close buttons
    const closeBtns = document.querySelectorAll('.modal-close-btn');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('active');
      });
    });

    // Close modal on backdrop click
    const modallayers = document.querySelectorAll('.modal-backdrop');
    modallayers.forEach((layer) => {
      layer.addEventListener('click', (e) => {
        if (e.target === layer) {
          layer.classList.remove('active');
        }
      });
    });
  }

  /* ==========================================================================
     13. GUESTBOOK / WISHES WALL (Scene 5)
     ========================================================================== */
  function initGuestbook() {
    const listEl = document.getElementById('guestbook-list');
    const formEl = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('guestbook-name');
    const msgInput = document.getElementById('guestbook-msg');

    if (!listEl || !formEl) return;

    const defaultNotes = [
      {
        author: 'With Love',
        text: 'Happy Birthday Sreoshi! May all your biggest dreams turn into reality this year! 🌟',
        date: '15 Nov',
      },
      {
        author: 'Heartfelt Wishes',
        text: 'To the most radiant person with the sweetest smile — have a wonderful 15th November celebration! 🌸',
        date: '15 Nov',
      },
    ];

    let savedNotes = [];
    try {
      const stored = localStorage.getItem('sreoshi_guestbook_notes');
      savedNotes = stored ? JSON.parse(stored) : defaultNotes;
    } catch (e) {
      savedNotes = defaultNotes;
    }

    function renderNotes() {
      listEl.innerHTML = '';
      savedNotes.forEach((note) => {
        const card = document.createElement('div');
        card.className = 'guestbook-card';
        card.innerHTML = `
          <div class="guestbook-header">
            <span class="guestbook-author">${escapeHtml(note.author)}</span>
            <span class="guestbook-time">${escapeHtml(note.date)}</span>
          </div>
          <p class="guestbook-body">${escapeHtml(note.text)}</p>
        `;
        listEl.appendChild(card);
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    renderNotes();

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = nameInput.value.trim();
      const text = msgInput.value.trim();
      if (!author || !text) return;

      const newNote = {
        author: author,
        text: text,
        date: 'Just now ✨',
      };

      savedNotes.unshift(newNote);
      try {
        localStorage.setItem('sreoshi_guestbook_notes', JSON.stringify(savedNotes));
      } catch (err) {}

      renderNotes();
      audio.playChime();
      fireConfettiCelebration();
      showToast('💌 Your birthday note has been posted for Sreoshi!');

      nameInput.value = '';
      msgInput.value = '';
    });
  }

  /* ==========================================================================
     14. GLOBAL MUSIC CONTROLLER & TRACK SELECTOR
     ========================================================================== */
  function initMusicController() {
    const musicBtn = document.getElementById('btn-music-toggle');
    const menuBtn = document.getElementById('btn-music-menu');
    const dropdown = document.getElementById('music-dropdown-menu');
    const trackNameEl = document.getElementById('current-track-name');
    const trackItems = document.querySelectorAll('.track-item-btn');
    const uploadMusicBtn = document.getElementById('btn-upload-custom-music');
    const customFileInput = document.getElementById('custom-music-file-input');

    if (!musicBtn) return;

    // Toggle Play / Pause
    musicBtn.addEventListener('click', () => {
      audio.init();
      if (state.isPlayingMusic) {
        audio.stopMelodyLoop();
      } else {
        audio.startMelodyLoop();
      }
    });

    // Dropdown toggle
    if (menuBtn && dropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.music-controls-group')) {
          dropdown.classList.remove('show');
        }
      });
    }

    // Switch Tracks
    trackItems.forEach((btn) => {
      if (btn.id === 'btn-upload-custom-music') return;

      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-track-src');
        const name = btn.getAttribute('data-track-name');

        trackItems.forEach((t) => t.classList.remove('active'));
        btn.classList.add('active');

        if (trackNameEl) trackNameEl.textContent = name;
        if (dropdown) dropdown.classList.remove('show');

        audio.setTrack(src);
        showToast(`🎶 Now Playing: ${name}`);
      });
    });

    // Upload custom music file
    if (uploadMusicBtn && customFileInput) {
      uploadMusicBtn.addEventListener('click', () => {
        customFileInput.click();
      });

      customFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        const displayName = `🎵 ${file.name.slice(0, 15)}...`;

        if (trackNameEl) trackNameEl.textContent = displayName;
        if (dropdown) dropdown.classList.remove('show');

        trackItems.forEach((t) => t.classList.remove('active'));
        audio.setTrack(objectUrl);
        showToast(`🎶 Playing your custom song: ${file.name}!`);
      });
    }
  }

  /* ==========================================================================
     15. DOMContentLoaded BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Canvas Particle Background
    new ParticleBackground('starfield-canvas');

    // 2. Initialize Fireworks Engine
    const fireworks = new FireworksEngine('fireworks-canvas');

    // 3. Initialize UI & Event Handlers
    initMusicController();
    initIntroAndCountdown();
    initPolaroidGallery();
    initWishBubbles();
    initCandleAndFireworks(fireworks);
    initGuestbook();
    initNavigation();
    spawnFloatingBalloons(5);

    // 4. Subtle user gesture audio primer
    document.addEventListener(
      'click',
      () => {
        if (!state.audioInitialized) {
          audio.init();
        }
      },
      { once: true }
    );
  });
})();
