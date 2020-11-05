import { Status } from './status';
import { setGain } from './utilities';

export class Track {
  constructor(
    audioContext: AudioContext,
    output: AudioNode,
    readonly filename: string,
    readonly description: string,
    readonly group?: string) {
    this._audioElement = document.createElement("audio");
    this._audioSourceNode = audioContext.createMediaElementSource(this._audioElement);
    this._gainNode = audioContext.createGain();
    this._gainNodeMaster = audioContext.createGain();
    this._audioSourceNode.connect(this._gainNode).connect(this._gainNodeMaster).connect(output);
    this._audioElement.src = this.filename;
    this._audioElement.preload = "auto";
    this._audioElement.load();
  }
  private readonly _audioElement: HTMLAudioElement;
  private readonly _audioSourceNode: MediaElementAudioSourceNode;
  private readonly _gainNode: GainNode;
  private readonly _gainNodeMaster: GainNode;
  private _active: boolean = true;
  get active() { return this._active; }
  activate(group?: string) {
    this._active = !group || (group === this.group);
    this._active ? this.unmute(2) : this.mute(3);
  }
  get volume() { return this._gainNode.gain.value; }
  setVolume(value: number, fadeSeconds: number) { setGain(this._gainNode, value, fadeSeconds); }
  mute(fadeSeconds: number) { setGain(this._gainNodeMaster, 0, fadeSeconds); }
  unmute(fadeSeconds: number) { setGain(this._gainNodeMaster, 1, fadeSeconds); }
  readonly busy: Status = new Status();
  private _playing: boolean = false;
  get playing() { return this._playing; }
  setPlaybackRate(rate: number) { this._audioElement.playbackRate = rate; }
  seek(seconds: number) {
    this.busy.push();
    return new Promise<void>((resolve, reject) => {
      let cancel = setTimeout(() => { reject(this._audioElement.readyState); }, 1500);
      this._audioElement.currentTime = seconds;
      this._audioElement.oncanplaythrough = () => {
        clearTimeout(cancel);
        resolve();
      };
    }).catch((readyState: number) => {
      console.error("emu:track:seek", this.description, readyState);
    }).finally(this.busy.pop);
  }
  play() {
    this.busy.push();
    return this._audioElement.play()
      .catch(() => { console.error("emu:track:play", this.description); })
      .then(() => { this._playing = true; })
      .finally(() => { this.busy.pop(); });
  }
  pause() {
    this.busy.push();
    return new Promise<void>((resolve, reject) => {
      if (this._audioElement.paused) resolve();
      else {
        let cancel = setTimeout(() => { reject(this._audioElement.paused); }, 500);
        this._audioElement.onpause = () => {
          clearTimeout(cancel);
          this._audioElement.onpause = null;
          resolve();
        };
        this._audioElement.pause();
      }
    }).then(() => { this._playing = false; }).finally(this.busy.pop);;
  }
}
