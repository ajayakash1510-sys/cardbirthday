// Web Audio API implementation for Happy Birthday tune and interactive sound effects
// Completely offline, no external audio files required.

type NoteFreq = {
  note: string;
  freq: number;
  duration: number; // in beats
};

// Standard frequencies for Happy Birthday in key of C
const NOTE_FREQS: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  REST: 0,
};

// "Happy Birthday to You" melody with musical timing
const HAPPY_BIRTHDAY_MELODY: NoteFreq[] = [
  // Phrase 1: Happy birthday to you
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.75 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.25 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 1.0 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 1.0 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.0 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 2.0 },
  { note: 'REST', freq: 0, duration: 0.5 },

  // Phrase 2: Happy birthday to you
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.75 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.25 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 1.0 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 1.0 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 1.0 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 2.0 },
  { note: 'REST', freq: 0, duration: 0.5 },

  // Phrase 3: Happy birthday dear [Friend]
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.75 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.25 },
  { note: 'G5', freq: NOTE_FREQS.G5, duration: 1.0 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 1.0 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.0 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 1.0 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 2.0 },
  { note: 'REST', freq: 0, duration: 0.5 },

  // Phrase 4: Happy birthday to you!
  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.75 },
  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.25 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 1.0 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.0 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 1.0 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 2.5 },
  { note: 'REST', freq: 0, duration: 1.0 },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingTune: boolean = false;
  private currentTimeout: number | null = null;
  private stepListeners: Set<(playing: boolean) => void> = new Set();

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.stepListeners.add(listener);
    listener(this.isPlayingTune);
    return () => {
      this.stepListeners.delete(listener);
    };
  }

  private notify() {
    this.stepListeners.forEach((l) => l(this.isPlayingTune));
  }

  // Play a music-box/chime bell tone
  private playBellNote(freq: number, durationSec: number, startTime: number) {
    if (!freq || freq <= 0) return;
    const ctx = this.getAudioContext();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle overtone for a music box resonance
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Warm envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec * 1.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + durationSec * 1.3);
    osc2.stop(startTime + durationSec * 1.3);
  }

  public toggleTune() {
    if (this.isPlayingTune) {
      this.stopTune();
    } else {
      this.startTune();
    }
  }

  public startTune() {
    try {
      const ctx = this.getAudioContext();
      this.stopTune();
      this.isPlayingTune = true;
      this.notify();

      const beatDuration = 0.55; // tempo ~110 bpm
      let currentBeatOffset = 0;

      const scheduleLoop = () => {
        if (!this.isPlayingTune) return;
        const now = ctx.currentTime + 0.05;
        currentBeatOffset = 0;

        HAPPY_BIRTHDAY_MELODY.forEach((item) => {
          const noteStart = now + currentBeatOffset * beatDuration;
          const noteDur = item.duration * beatDuration;
          if (item.freq > 0) {
            this.playBellNote(item.freq, noteDur, noteStart);
          }
          currentBeatOffset += item.duration;
        });

        const totalMelodySec = currentBeatOffset * beatDuration;
        this.currentTimeout = window.setTimeout(() => {
          if (this.isPlayingTune) {
            scheduleLoop();
          }
        }, totalMelodySec * 1000);
      };

      scheduleLoop();
    } catch (e) {
      console.warn('Audio playback not allowed yet without user gesture', e);
      this.isPlayingTune = false;
      this.notify();
    }
  }

  public stopTune() {
    this.isPlayingTune = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.notify();
  }

  public get isPlaying(): boolean {
    return this.isPlayingTune;
  }

  // Sound effect: Balloon Pop!
  public playBalloonPop() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Pop oscillator (rapid frequency drop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);

      // Add a tiny noise snap
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // AudioContext fallback
    }
  }

  // Sound effect: Candle blown out (whoosh / breath puff)
  public playCandlePuff() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.14);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // AudioContext fallback
    }
  }

  // Sound effect: All candles celebration fanfare chime!
  public playCelebrationChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major chord arpeggio sparkle

      chords.forEach((freq, idx) => {
        const time = now + idx * 0.12;
        this.playBellNote(freq, 1.4, time);
      });
    } catch {
      // AudioContext fallback
    }
  }

  // Sound effect: Envelope letter opening whoosh / paper rustle
  public playEnvelopeOpen() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      this.playBellNote(NOTE_FREQS.G4, 0.4, now);
      this.playBellNote(NOTE_FREQS.C5, 0.7, now + 0.1);
      this.playBellNote(NOTE_FREQS.E5, 0.9, now + 0.2);
    } catch {
      // AudioContext fallback
    }
  }
}

export const soundEngine = new SoundEngine();
