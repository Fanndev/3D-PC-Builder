/* ==========================================================================
   PC BUILDER 101 — MULTIMEDIA AUDIO ENGINE
   Web Audio API Synthesizer, BIOS Beep Oscilloscope, SFX, BGM & Voice-Over
   ========================================================================== */

class MultimediaAudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.sfxEnabled = true;
    this.bgmPlaying = false;
    this.bgmNodes = [];
    this.bgmAudioEl = null;
    this.currentVoiceAudio = null;
    this.isSpeaking = false;
    this.beepTimerIds = [];
    this.waveformAnimId = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /* --------------------------------------------------------------------------
     UI & 3D INTERACTION SOUND EFFECTS (SFX)
     -------------------------------------------------------------------------- */
  playClick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.055);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  playInstallSnap() {
    if (!this.sfxEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;

    // Mechanical lock click + harmonic confirmation chime
    const freqs = [320, 640, 1280];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      const start = now + idx * 0.055;
      osc.frequency.setValueAtTime(f, start);
      osc.frequency.exponentialRampToValueAtTime(f * 1.25, start + 0.14);
      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
  }

  playPowerOnBoot() {
    if (!this.sfxEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;

    // 1. Single POST Beep (1000Hz)
    const beepOsc = this.ctx.createOscillator();
    const beepGain = this.ctx.createGain();
    beepOsc.type = 'square';
    beepOsc.frequency.setValueAtTime(1000, now + 0.15);
    beepGain.gain.setValueAtTime(0.12, now + 0.15);
    beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    beepOsc.connect(beepGain);
    beepGain.connect(this.ctx.destination);
    beepOsc.start(now + 0.15);
    beepOsc.stop(now + 0.34);

    // 2. Futuristic Power-Up Chord
    const chord = [261.63, 329.63, 392.00, 523.25];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.85);
      gain.gain.setValueAtTime(0.01, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + 0.35);
      osc.stop(now + 1.85);
    });
  }

  playError() {
    if (!this.sfxEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(165, now + 0.12);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playQuizFeedback(correct) {
    if (!this.sfxEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;
    if (correct) {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      });
    } else {
      this.playError();
    }
  }

  /* --------------------------------------------------------------------------
     BIOS BEEP CODE SYNTHESIZER & REAL-TIME OSCILLOSCOPE
     -------------------------------------------------------------------------- */
  stopBiosBeep() {
    this.beepTimerIds.forEach(id => clearTimeout(id));
    this.beepTimerIds = [];
  }

  playBiosBeepPattern(beepItem, onComplete) {
    this.initContext();
    this.stopBiosBeep();

    let offset = 0;
    const now = this.ctx.currentTime;

    beepItem.pattern.forEach((step) => {
      const startAt = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(step.freq, startAt);

      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.16, startAt + 0.01);
      gain.gain.setValueAtTime(0.16, startAt + step.duration - 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + step.duration);

      osc.connect(gain);
      gain.connect(this.analyser);

      osc.start(startAt);
      osc.stop(startAt + step.duration);

      offset += step.duration + step.gap;
    });

    this.startWaveformVisualizer('#beep-waveform', beepItem.color || '#00f0ff');

    const totalMs = Math.ceil(offset * 1000) + 150;
    const timerId = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
    this.beepTimerIds.push(timerId);
  }

  startWaveformVisualizer(canvasSelector, strokeColor = '#00f0ff') {
    const canvas = document.querySelector(canvasSelector);
    if (!canvas || !this.analyser) return;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (this.waveformAnimId) cancelAnimationFrame(this.waveformAnimId);

    const renderFrame = () => {
      this.waveformAnimId = requestAnimationFrame(renderFrame);
      this.analyser.getByteTimeDomainData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      canvasCtx.fillStyle = '#040710';
      canvasCtx.fillRect(0, 0, width, height);

      // Subtle reference grid line
      canvasCtx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, height / 2);
      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();

      // Active Oscilloscope Waveform
      canvasCtx.lineWidth = 2.2;
      canvasCtx.strokeStyle = strokeColor;
      canvasCtx.shadowColor = strokeColor;
      canvasCtx.shadowBlur = 8;
      canvasCtx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0;
    };

    renderFrame();
  }

  /* --------------------------------------------------------------------------
     VOICE-OVER NARRATION (MP3 FILE WITH INDONESIAN SPEECH SYNTHESIS FALLBACK)
     -------------------------------------------------------------------------- */
  stopVoiceOver() {
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.pause();
      this.currentVoiceAudio.currentTime = 0;
      this.currentVoiceAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  playVoiceOver(text, audioFileUrl, onStateChange) {
    if (this.isSpeaking) {
      this.stopVoiceOver();
      if (onStateChange) onStateChange(false);
      return;
    }

    this.stopVoiceOver();
    this.isSpeaking = true;
    if (onStateChange) onStateChange(true);

    // Try custom recorded MP3 file first if placed by the team in assets/audio/
    if (audioFileUrl) {
      const audio = new Audio(audioFileUrl);
      this.currentVoiceAudio = audio;
      let handledFallback = false;

      audio.onended = () => {
        this.isSpeaking = false;
        if (onStateChange) onStateChange(false);
      };

      audio.onerror = () => {
        if (!handledFallback) {
          handledFallback = true;
          this.speakWithBrowserTTS(text, onStateChange);
        }
      };

      audio.play().catch(() => {
        if (!handledFallback) {
          handledFallback = true;
          this.speakWithBrowserTTS(text, onStateChange);
        }
      });
    } else {
      this.speakWithBrowserTTS(text, onStateChange);
    }
  }

  speakWithBrowserTTS(text, onStateChange) {
    if (!('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (onStateChange) onStateChange(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('id'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onStateChange) onStateChange(false);
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onStateChange) onStateChange(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  /* --------------------------------------------------------------------------
     AMBIENT TECH BACKSOUND (BGM)
     -------------------------------------------------------------------------- */
  toggleBgm() {
    this.initContext();
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.bgmPlaying = true;
    const now = this.ctx.currentTime;

    // Gentle futuristic ambient pad chord (C#m9 / Asus2 warm cyber drone)
    const freqs = [110.0, 164.81, 220.0, 277.18, 329.63];
    this.bgmNodes = freqs.map((f, idx) => {
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, now);
      lfoGain.gain.setValueAtTime(0.008, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018 / freqs.length, now + 1.5);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      lfo.start(now);
      return { osc, lfo, gain };
    });
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmNodes.forEach(node => {
      try {
        node.gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
        node.osc.stop(now + 0.45);
        node.lfo.stop(now + 0.45);
      } catch (e) {}
    });
    this.bgmNodes = [];
  }
}

window.audioEngine = new MultimediaAudioEngine();
