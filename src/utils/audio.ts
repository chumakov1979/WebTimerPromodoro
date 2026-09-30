import { AmbientSoundType, SoundNotificationType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTick(volume = 30) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const vol = Math.max(0, Math.min(1, (volume / 100) * 0.12));
    const now = ctx.currentTime;

    // Metronome / stage drumstick click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.015);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch (err) {
    console.error('Failed to play tick:', err);
  }
}

export function playNotificationSound(type: SoundNotificationType, volume = 75) {
  try {
    const ctx = getAudioContext();
    const vol = Math.max(0, Math.min(1, volume / 100));
    const now = ctx.currentTime;

    switch (type) {
      case 'queenFanfare': {
        // Grand Royal Rock Fanfare (Queen style Power Chord: B - F# - B - D#)
        const notes = [246.94, 370.0, 493.88, 622.25];
        notes.forEach((freq, idx) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(freq, now);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 1.002, now); // slight chorus detune

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1800, now);
          filter.frequency.exponentialRampToValueAtTime(400, now + 2.8);

          const decay = 2.8;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(vol * 0.35, now + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + decay);
          osc2.stop(now + decay);
        });

        // Add a triumphant closing brass flare
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(987.77, now + 0.2); // B5 high crown
        leadGain.gain.setValueAtTime(0, now + 0.2);
        leadGain.gain.linearRampToValueAtTime(vol * 0.25, now + 0.25);
        leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start(now + 0.2);
        leadOsc.stop(now + 2.3);
        break;
      }

      case 'guitar': {
        // Harmonized guitar swell in D (D4 - A4 - D5 - F#5)
        const freqs = [293.66, 440.0, 587.33, 739.99];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200 + idx * 300, now);
          filter.Q.setValueAtTime(2.5, now);

          gain.gain.setValueAtTime(0, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(vol * 0.3, now + idx * 0.05 + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.05);
          osc.stop(now + 2.8);
        });
        break;
      }

      case 'ovation': {
        // Audience roaring applause & bravo cheering simulation
        for (let i = 0; i < 18; i++) {
          const clapTime = now + Math.random() * 1.8;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'square';
          osc.frequency.setValueAtTime(600 + Math.random() * 600, clapTime);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800 + Math.random() * 800, clapTime);
          filter.Q.setValueAtTime(5, clapTime);

          gain.gain.setValueAtTime(vol * (0.2 + Math.random() * 0.2), clapTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, clapTime + 0.08);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(clapTime);
          osc.stop(clapTime + 0.09);
        }

        // Triumphant audience roar noise bed
        const bufferSize = ctx.sampleRate * 2.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          output[j] = Math.random() * 2 - 1;
        }
        const crowdSource = ctx.createBufferSource();
        crowdSource.buffer = noiseBuffer;
        const crowdFilter = ctx.createBiquadFilter();
        crowdFilter.type = 'lowpass';
        crowdFilter.frequency.setValueAtTime(900, now);
        const crowdGain = ctx.createGain();
        crowdGain.gain.setValueAtTime(0, now);
        crowdGain.gain.linearRampToValueAtTime(vol * 0.35, now + 0.3);
        crowdGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

        crowdSource.connect(crowdFilter);
        crowdFilter.connect(crowdGain);
        crowdGain.connect(ctx.destination);
        crowdSource.start(now);
        crowdSource.stop(now + 2.7);
        break;
      }

      case 'chime': {
        // Opera House Bell
        const freqs = [523.25, 1046.5, 1569.75];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const decay = 2.4 - idx * 0.4;
          gain.gain.setValueAtTime(vol * 0.5 * (1 / (idx + 1)), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }

      case 'gong': {
        // Grand Bohemian Gong (Bohemian Rhapsody style final gong strike)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(110, now);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(165, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(130, now + 3.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol * 0.75, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 4.2);
        osc2.stop(now + 4.2);
        break;
      }
    }
  } catch (err) {
    console.error('Failed to play notification sound:', err);
  }
}

// Queen Ambient Soundscape Manager
class AmbientSoundManager {
  private currentType: AmbientSoundType = 'none';
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private currentVolume = 50;

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(100, volume));
    if (this.masterGain && audioCtx) {
      const targetVol = (this.currentVolume / 100) * 0.35;
      this.masterGain.gain.setTargetAtTime(targetVol, audioCtx.currentTime, 0.1);
    }
  }

  public play(type: AmbientSoundType, volume = this.currentVolume) {
    this.stop();
    if (type === 'none') {
      this.currentType = 'none';
      return;
    }

    try {
      const ctx = getAudioContext();
      this.currentType = type;
      this.currentVolume = volume;
      this.isPlaying = true;

      const master = ctx.createGain();
      const targetVol = (volume / 100) * 0.35;
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 1.0);
      master.connect(ctx.destination);
      this.masterGain = master;

      if (type === 'vinyl') {
        this.setupVinyl(ctx, master);
      } else if (type === 'crowd') {
        this.setupConcertHall(ctx, master);
      } else if (type === 'rain') {
        this.setupRain(ctx, master);
      } else if (type === 'binaural') {
        this.setupOperaDrone(ctx, master);
      } else if (type === 'fireplace') {
        this.setupFireplace(ctx, master);
      }
    } catch (e) {
      console.error('Failed to start ambient sound:', e);
    }
  }

  public stop() {
    if (this.masterGain && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      } catch (e) {
        // ignore
      }
    }

    this.nodes.forEach((item) => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
        try {
          (item as AudioScheduledSourceNode).stop();
        } catch (e) {
          // ignore
        }
      }
    });

    this.nodes = [];
    this.isPlaying = false;
    this.masterGain = null;
  }

  public getType(): AmbientSoundType {
    return this.currentType;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Vintage vinyl record hiss & crackle
  private setupVinyl(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);

    noise.connect(filter);
    filter.connect(destination);
    noise.start();
    this.nodes.push(noise);

    // Random needle pops & clicks
    const interval = window.setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.45) {
        try {
          const popOsc = ctx.createOscillator();
          const popGain = ctx.createGain();
          const popFilter = ctx.createBiquadFilter();
          const now = ctx.currentTime;

          popFilter.type = 'bandpass';
          popFilter.frequency.setValueAtTime(2500 + Math.random() * 2000, now);
          popFilter.Q.setValueAtTime(12, now);

          popOsc.type = 'triangle';
          popOsc.frequency.setValueAtTime(1000 + Math.random() * 800, now);

          popGain.gain.setValueAtTime(0.09 * Math.random(), now);
          popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

          popOsc.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(destination);

          popOsc.start(now);
          popOsc.stop(now + 0.025);
        } catch (e) {
          // ignore
        }
      }
    }, 120);

    this.nodes.push(interval);
  }

  // Concert Hall murmur before the show
  private setupConcertHall(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(550, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    noise.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(destination);
    noise.start();
    this.nodes.push(noise);
  }

  // Dramatic Backstage Rain
  private setupRain(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, ctx.currentTime);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(320, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.38, ctx.currentTime);

    noise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(destination);

    noise.start();
    this.nodes.push(noise);
  }

  // Grand Hall Opera Drone (432 Hz + 436 Hz warm binaural drone)
  private setupOperaDrone(ctx: AudioContext, destination: AudioNode) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscSub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220, ctx.currentTime);

    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(108, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    oscSub.connect(gain);
    gain.connect(destination);

    osc1.start();
    osc2.start();
    oscSub.start();
    this.nodes.push(osc1, osc2, oscSub);
  }

  // Fireplace / warm vintage hearth
  private setupFireplace(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(260, ctx.currentTime);

    noise.connect(lowpass);
    lowpass.connect(destination);
    noise.start();
    this.nodes.push(noise);
  }
}

export const ambientPlayer = new AmbientSoundManager();
