import { Song } from './song';
import { Section } from './section';
import { Measure } from './measure';
import { inRange } from './utilities';

export class Clock {
  constructor(
    private readonly _audioContext: AudioContext,
    private readonly _song: Song) { }
  private _secondsElapsed: number = 0;
  private _seconds: number = 0;
  get seconds() { return this._seconds; }
  set seconds(seconds: number) {
    this._seconds = this._secondsElapsed = seconds;
    this._beats = this._secondsToBeats(seconds);
    this._synchronise();
  }
  private _beats: number = 0;
  get beats() { return this._beats; }
  set beats(beats: number) {
    this._beats = beats;
    this._seconds = this._secondsElapsed = this._beatsToSeconds(beats);
    this._synchronise();
  }
  get progress(): number { return (this._beats / this._song!.endIndex * 100) ?? 0; }
  private _section?: Section;
  get section() { return this._section; }
  private _measure?: Measure;
  get measure() { return this._measure; }
  private _synchronise() {
    let beats = this._beats;
    if (inRange(beats, this._measure, this._section, this._song)) return;
    if (!inRange(beats, this._song, this._section)) {
      delete this._section; delete this._measure;
      for (let i = 0; i < this._song.sections.length; i++)
        if (inRange(beats, this._song.sections[i])) {
          this._section = this._song.sections[i];
          break;
        }
    }
    if (!inRange(beats, this._measure)) {
      if (inRange(beats, this._section)) {
        for (let i = 0; i < this._section!.measures.length; i++)
          if (inRange(beats, this._section!.measures[i])) {
            this._measure = this._section!.measures[i];
            break;
          }
      }
    }
  }
  private _playbackRate: number = 1;
  set playbackRate(rate: number) { this._playbackRate = rate; }
  get playbackRate() { return this._playbackRate; }
  get bpm() { return this._song.bpm * this._playbackRate; }
  private get _secondsPerBeat() { return 60 / this.bpm; }
  private _secondsToBeats(seconds: number) { return Math.floor(seconds <= this._song.startOffset ? 0 : (seconds - this._song.startOffset) / this._secondsPerBeat + 1); }
  private _beatsToSeconds(beats: number) { return beats * this._secondsPerBeat; }
  private _frameHandle?: number;
  start(time = this._audioContext.currentTime) {
    this._frameHandle = requestAnimationFrame(() => {
      let seconds = -time + (time = this._audioContext.currentTime);
      this._seconds += seconds;
      this._secondsElapsed += seconds * this._playbackRate;
      if (this._beats !== (this._beats = this._secondsToBeats(this._secondsElapsed))) this._synchronise();
      this.start(time);
    });
  }
  stop() { cancelAnimationFrame(this._frameHandle!); }
}
