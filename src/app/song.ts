import { HttpClient } from '@angular/common/http';
import { ICatalog, ISong } from './icatalog';
import { IBreakdown } from './ibreakdown';
import { Tracks } from './tracks';
import { Sections } from './sections';
import { Section } from './section';
import { IRange } from './utilities';

export interface IStartIndex { startIndex: number; }
export type IPlaybackRate = "slow" | "normal" | "fast";

export class Song implements ISong, IRange {
  static load(audioContext: AudioContext, masterGainNode: GainNode, http: HttpClient, songId: string) {
    return new Promise<Song>((resolve, reject) => {
      let path = "assets/songs/";
      http.get<ICatalog>(`${path}catalog.json`)
        .subscribe((iCatalog) => {
          path += `${songId}/`;
          http.get<IBreakdown>(`${path}breakdown.json`)
            .subscribe((iBreakdown) => {
              resolve(new Song(audioContext, masterGainNode, path, iCatalog.songs[songId], iBreakdown));
            }, reject);
        }, reject);
    });
  }
  constructor(audioContext: AudioContext, masterGainNode: GainNode, readonly path: string, iSong: ISong, iBreakdown: IBreakdown) {
    this.title = iSong.title;
    this.artist = iSong.artist;
    this.genre = iSong.genre;
    this.bpm = iSong.bpm;
    this.startOffset = iBreakdown.startOffset ?? 0;
    this._tracks = Tracks.load(audioContext, masterGainNode, this.path, iBreakdown.tracks);
    let startIndex: IStartIndex = { startIndex: 1 };
    this.sections = Sections.load(iBreakdown, startIndex);
    this.endIndex = startIndex.startIndex - 1;
  }
  readonly title: string;
  readonly artist: string;
  readonly genre: string;
  readonly startOffset: number;
  readonly bpm: number;
  private readonly _tracks: Tracks;
  get tracks() { return this._tracks.active; }
  readonly sections: Section[];
  readonly startIndex: number = 1;
  readonly endIndex: number;
  async play(seconds: number) { await this._tracks.play(seconds); }
  async pause() { await this._tracks.pause(); }
}
