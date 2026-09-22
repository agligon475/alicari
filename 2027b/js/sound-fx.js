/**
 * ALICARI 2027b - De Stijl Micro Acoustic Feedback Engine (Web Audio API)
 * Generates delicate procedural audio clicks, harmonic chimes and tactile feedback.
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('alicari_destijl_sound') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('alicari_destijl_sound', this.enabled);
    if (this.enabled) {
      this.init();
      this.playChime(520, 0.15, 'sine');
    }
    return this.enabled;
  }

  playTick(freq = 800, gain = 0.04) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.035);

      g.gain.setValueAtTime(gain, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(g);
      g.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playChime(freq = 440, duration = 0.35, type = 'triangle') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, this.ctx.currentTime + duration);

      g.gain.setValueAtTime(0.06, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(g);
      g.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playPop() {
    this.playTick(1200, 0.03);
  }

  playSelect() {
    this.playChime(660, 0.12, 'sine');
  }

  playOpen() {
    this.playChime(400, 0.25, 'sine');
  }

  playClose() {
    this.playTick(450, 0.04);
  }
}

export const sound = new SoundEngine();
