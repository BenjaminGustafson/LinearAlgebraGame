export class AudioManager {
  constructor() {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.buffers = new Map();

      this.globalVolume = 0.25
      this.lastTimePlayed = {}
  }

  async load(name, url) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(name, audioBuffer);
  }

  /**
   * 
   * @param {*} name 
   * @param {*} pitch - number of semitones to pitch shift up
   * @param {*} volume 
   * @param {*} force 
   * @returns 
   */
  play(name, {pitch = 0 , volume = 1.0, force = false, channel = 0} = {}) {
      this.lastTimePlayed[name] ??= {}
      if (!force && (this.lastTimePlayed[name][channel] != null && Date.now() - this.lastTimePlayed[name][channel] < 35)) {
          return;
      }
      if(this.context.state === 'suspended'){
          this.context.resume();
          return
      }

      
      this.lastTimePlayed[name][channel] = Date.now()
  
      const buffer = this.buffers.get(name);
      if (!buffer) return;
  
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = Math.pow(2, pitch / 12);
  
      const gainNode = this.context.createGain();
      gainNode.gain.value = volume * this.globalVolume;
  
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
  
      source.start(0);
  }

  playSine(frequency = 440, channel = 0, duration = 0.1, volume = 0.1) {
    this.lastTimePlayed['sine'] ??= {}
    if (!this.lastTimePlayed['sine'][channel] != null && Date.now() - this.lastTimePlayed['sine'][channel] < 50) {
        return;
    }
    this.lastTimePlayed['sine'][channel] = Date.now()

    const now = this.context.currentTime;

    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;

    const gainNode = this.context.createGain();

    const attack = 0.001;
    const release = 0.2;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);

    const fadeOutStart = Math.max(now + attack,now + duration - release);

    gainNode.gain.setValueAtTime(volume, fadeOutStart);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gainNode);
    gainNode.connect(this.context.destination);

    osc.start(now);
    osc.stop(now + duration);
}
  
  

  unlock() {
      if (this.context.state === 'suspended') {
          this.context.resume();
      }
  }
}


export const audioManager = new AudioManager();
const audioPaths = ["click1.ogg", 'card-slide-1.wav', 'switch8.wav', 'error_005.ogg'];

Promise.all(
    audioPaths.map(path => {
        const name = path.split(".")[0]; // drop file extension
        return audioManager.load(name, "src/audio/sounds/" + path)
    })
).then(() => {
    console.log("All audio loaded.")
})