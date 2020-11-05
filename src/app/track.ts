import { Status } from './status';
import { IVolume, setGain } from './utilities';

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
    this.setVolume("down", 0);
    this.unmute(0);
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
  private _volume: IVolume = "down";
  get volume() { return this._volume; }
  setVolume(volume: IVolume, fadeSeconds: number) {
    let value;
    switch (this._volume = volume) {
      case "off": value = 0; break;
      case "up": value = 1; break;
      default: value = 0.5; break;
    }
    setGain(this._gainNode, value, fadeSeconds);
  }
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
      this._audioElement.oncanplaythrough = function () {
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
      .finally(this.busy.pop);
  }
  pause() {
    this.busy.push();
    return new Promise<void>((resolve, reject) => {
      if (this._audioElement.paused) resolve();
      else {
        let cancel = setTimeout(() => { reject(this._audioElement.paused); }, 500);
        this._audioElement.onpause = function () {
          clearTimeout(cancel);
          resolve();
        };
        this._audioElement.pause();
      }
    }).then(() => { this._playing = false; })
      .finally(this.busy.pop);;
  }
}
