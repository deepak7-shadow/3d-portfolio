/**
 * Web Audio API Procedural Cosmic Sound Synthesizer
 * Generates an ambient space drone, cosmic wind, and holographic UI telemetry sounds.
 * Requires 0 external audio files!
 */

export class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.noiseNode = null;
    this.filter = null;
    this.initUI();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.initContext();

    if (!this.isPlaying) {
      this.startAmbientDrone();
      this.isPlaying = true;
      this.updateButtonUI(true);
    } else {
      this.stopAmbientDrone();
      this.isPlaying = false;
      this.updateButtonUI(false);
    }
    return this.isPlaying;
  }

  startAmbientDrone() {
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0.35, t + 2.0);

    // 1. Binaural Sub-Bass Resonance (55Hz & 58Hz for ~3Hz cosmic pulse)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(55, t);
    osc2.frequency.setValueAtTime(58.2, t);

    // Filter to warm up tone
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(140, t);
    this.filter.Q.setValueAtTime(3.0, t);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.5, t);

    osc1.connect(this.filter);
    osc2.connect(this.filter);
    this.filter.connect(bassGain);
    bassGain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    this.oscillators.push(osc1, osc2);

    // 2. Cosmic Solar Wind (Filtered White Noise Buffer)
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(420, t);
    noiseFilter.Q.setValueAtTime(2.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, t);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    this.noiseNode.start(t);

    // 3. Shimmer Pad Chord (High Celestial Ethereal Tone)
    const padOsc = this.ctx.createOscillator();
    padOsc.type = 'triangle';
    padOsc.frequency.setValueAtTime(220, t); // A3

    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(450, t);

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.08, t);

    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.masterGain);

    padOsc.start(t);
    this.oscillators.push(padOsc);
  }

  stopAmbientDrone() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0.001, t + 1.2);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch (e) {}
        this.noiseNode = null;
      }
    }, 1300);
  }

  // Futuristic UI Hologram Blip (for card hovers & clicks)
  playUIBlip(pitch = 880) {
    if (!this.isPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + 0.08);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Warp Transition Sound (when clicking navigation jump)
  playWarpTransition() {
    if (!this.isPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.9);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.3);
    gain.gain.linearRampToValueAtTime(0.0001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.95);
  }

  initUI() {
    const soundBtn = document.getElementById('audio-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Attach UI blips to interactive elements
    const interactives = document.querySelectorAll('a, button, .interactive-card');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => this.playUIBlip(1200));
      el.addEventListener('click', () => this.playUIBlip(600));
    });
  }

  updateButtonUI(active) {
    const waves = document.getElementById('audio-waves');
    const label = document.getElementById('audio-label');
    if (waves) {
      if (active) {
        waves.classList.remove('opacity-30');
        waves.classList.add('opacity-100');
      } else {
        waves.classList.add('opacity-30');
        waves.classList.remove('opacity-100');
      }
    }
    if (label) {
      label.innerText = active ? 'TRANSMISSION ACTIVE' : 'AUDIO OFF';
    }
  }
}
