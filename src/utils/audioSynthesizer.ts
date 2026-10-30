/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API Synthesizer for Ghost Satellite Telemetry & Ambient Static

class GhostAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientNoiseNode: AudioNode | null = null;
  private ambientDroneOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private analyserNode: AnalyserNode | null = null;
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;
      
      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleAmbient(): boolean {
    this.initContext();
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public toggleAudio(enable: boolean) {
    if (enable) {
      if (!this.isAmbientPlaying) {
        this.startAmbient();
      }
    } else {
      if (this.isAmbientPlaying) {
        this.stopAmbient();
      }
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  // Auto-ignite ambient horror soundscape on mount / first user interaction
  public autoStart() {
    if (!this.isAmbientPlaying) {
      try {
        this.startAmbient();
      } catch {
        // Handled by browser autoplay policy until user gesture
      }
    }
  }

  private startAmbient() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // 1. Pink/Cosmic Noise generator (White noise filtered down)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter for eerie space telemetry crackle
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // 2. Deep Sub-Bass Space Vacuum Drone (52Hz sine + 53.2Hz sine for beating horror hum)
    const droneOsc1 = this.ctx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(52, this.ctx.currentTime);

    const droneOsc2 = this.ctx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(53.2, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    const ambientGain = this.ctx.createGain();
    ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 1.2);

    whiteNoise.connect(bandpass);
    bandpass.connect(ambientGain);

    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneGain.connect(ambientGain);

    ambientGain.connect(this.masterGain);

    whiteNoise.start();
    droneOsc1.start();
    droneOsc2.start();

    this.ambientNoiseNode = whiteNoise;
    this.ambientDroneOsc = droneOsc1;
    this.ambientGain = ambientGain;
    this.isAmbientPlaying = true;
  }

  private stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    setTimeout(() => {
      try {
        if (this.ambientNoiseNode && 'stop' in this.ambientNoiseNode) {
          (this.ambientNoiseNode as AudioScheduledSourceNode).stop();
        }
        if (this.ambientDroneOsc) {
          this.ambientDroneOsc.stop();
        }
      } catch {
        // ignore already stopped
      }
      this.isAmbientPlaying = false;
    }, 500);
  }

  // Play ghost telemetry lock tone when satellite is selected
  public playCarrierTone(frequency: number = 220) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency * 0.8, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency, this.ctx.currentTime + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.48);
    } catch {
      // Audio context policy
    }
  }

  // Radar sweep ping sound
  public playRadarPing() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch {
      // Audio policy
    }
  }

  // Digital Séance medium invocation sound
  public playSeanceInvocation() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const notes = [174, 285, 396, 528];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, this.ctx.currentTime + idx * 0.08 + 0.8);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + idx * 0.08 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 1.3);
      });
    } catch {
      // Audio policy
    }
  }

  // Typewriter micro-chirp for streaming terminal text
  public playTerminalBlip() {
    try {
      if (!this.ctx || !this.masterGain || this.volume <= 0) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Audio policy
    }
  }

  // Telemetry anomaly warning alert chirp
  public playAnomalyAlert() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.volume <= 0) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // Audio policy
    }
  }
}

export const audioSynth = new GhostAudioSynthesizer();
