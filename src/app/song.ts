import { HttpClient } from '@angular/common/http';
import { IBreakdown } from './ibreakdown';
import { ICatalog } from './icatalog';
import { IndexTracker } from './index-tracker';
import { Section } from './section';
import { Sections } from './sections';

export class Song {
  static load(http: HttpClient, songId: string) {
    return new Promise<Song>((resolve, reject) => {
      let path = "assets/songs/";
      http.get<ICatalog>(`${path}catalog.json`)
        .subscribe((iCatalog) => {
          path += `${songId}/`;
          http.get<IBreakdown>(`${path}breakdown.json`)
            .subscribe((iBreakdown) => {
              let tracker = { startIndex: 1 },
                sections = Sections.load(iBreakdown.sections, iBreakdown.beatsPerMeasure, tracker.startIndex);
              let song = new Song(path,
                iCatalog.songs[songId].title,
                iCatalog.songs[songId].artist,
                iCatalog.songs[songId].genre,
                iCatalog.songs[songId].bpm,
                sections, 1, tracker.startIndex - 1);
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
    readonly sections: Sections,
    readonly startIndex: 1,
    readonly endIndex: number) { }
}
