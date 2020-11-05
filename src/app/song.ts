import { HttpClient } from '@angular/common/http';
import { ICatalog, ISong } from './icatalog';
import { IBreakdown } from './ibreakdown';
import { Tracks } from './tracks';
import { Sections } from './sections';
import { Section } from './section';

export interface IStartIndex { startIndex: number; }
export type IPlaybackRate = "slow" | "normal" | "fast";

export class Song implements ISong {
  static load(http: HttpClient, songId: string) {
    return new Promise<Song>((resolve, reject) => {
      let path = "assets/songs/";
      http.get<ICatalog>(`${path}catalog.json`)
        .subscribe((iCatalog) => {
          path += `${songId}/`;
          http.get<IBreakdown>(`${path}breakdown.json`)
            .subscribe((iBreakdown) => {
              resolve(new Song(path, iCatalog.songs[songId], iBreakdown));
            }, reject);
        }, reject);
    });
  }
  constructor(readonly path: string, iSong: ISong, iBreakdown: IBreakdown) {
    this._audioContext = new AudioContext();
    this._gainNode = this._audioContext.createGain();
    this._gainNode.connect(this._audioContext.destination);
    this.title = iSong.title;
    this.artist = iSong.artist;
    this.genre = iSong.genre;
    this._bpm = iSong.bpm;
    this._tracks = Tracks.load(this._audioContext, this._gainNode, this.path, iBreakdown.tracks);
    let startIndex: IStartIndex = { startIndex: 1 };
    this.sections = Sections.load(iBreakdown, startIndex);
    this.endIndex = startIndex.startIndex - 1;
    this.setPlaybackRate("normal");
  }
  private readonly _audioContext: AudioContext;
  private _resume(): Promise<void> {
    switch (this._audioContext.state) {
      case "running": return Promise.resolve();
      case "suspended": return this._audioContext.resume();
      default: return Promise.reject(this._audioContext.state);
    }
  }
  private _suspend(): Promise<void> {
    switch (this._audioContext.state) {
      case "suspended": return Promise.resolve();
      case "running": return this._audioContext.suspend();
      default: return Promise.reject(this._audioContext.state);
    }
  }
  private readonly _gainNode: AudioNode;
  readonly title: string;
  readonly artist: string;
  readonly genre: string;
  private _playbackRate: number = 1;
  get playbackRate(): IPlaybackRate {
    if (this._playbackRate < 1) return "slow";
    if (this._playbackRate > 1) return "fast";
    return "normal";
  }
  set playbackRate(rate: IPlaybackRate) {
    switch (rate) {
      case "slow": this._playbackRate = 0.9; break;
      case "fast": this._playbackRate = 1.1; break;
      default: this._playbackRate = 1; break;
    }
    this._tracks.setPlaybackRate(this._playbackRate);
  }
  setPlaybackRate(rate: IPlaybackRate) { this.playbackRate = rate; }
  isPlaybackRate(rate: IPlaybackRate) { return this.playbackRate === rate; }
  private readonly _bpm: number;
  get bpm() { return this._bpm * this._playbackRate; }
  private readonly _tracks: Tracks;
  get tracks() { return this._tracks.active; }
  readonly sections: Section[];
  readonly startIndex: number = 1;
  readonly endIndex: number;
  async play() {
    await this._resume();
    await this._tracks.play();
  }
}
