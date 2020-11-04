import { HttpClient } from '@angular/common/http';
import { IBreakdown } from './ibreakdown';
import { ICatalog } from './icatalog';
import { Section } from './section';
import { Sections } from './sections';
import { Tracks } from './tracks';

export interface IStartIndex { startIndex: number; }
export class Song {
  static load(audioContext: AudioContext, output: AudioNode, http: HttpClient, songId: string) {
    return new Promise<Song>((resolve, reject) => {
      let path = "assets/songs/";
      http.get<ICatalog>(`${path}catalog.json`)
        .subscribe((iCatalog) => {
          path += `${songId}/`;
          http.get<IBreakdown>(`${path}breakdown.json`)
            .subscribe((iBreakdown) => {
              let startIndex: IStartIndex = { startIndex: 1 },
                tracks = Tracks.load(audioContext, output, iBreakdown.tracks, path),
                sections = Sections.load(iBreakdown.sections, startIndex, iBreakdown.beatsPerMeasure);
              let song = new Song(path,
                iCatalog.songs[songId].title,
                iCatalog.songs[songId].artist,
                iCatalog.songs[songId].genre,
                iCatalog.songs[songId].bpm,
                tracks, sections,
                1, startIndex.startIndex - 1);
              resolve(song);
            }, reject);
        }, reject);
    });
  }
  constructor(
    readonly path: string,
    readonly title: string,
    readonly artist: string,
    readonly genre: string,
    readonly bpm: number,
    readonly tracks: Tracks,
    readonly sections: Section[],
    readonly startIndex: 1,
    readonly endIndex: number) {
    this.length = this.endIndex - this.startIndex + 1;
  }
  readonly length: number;
}
