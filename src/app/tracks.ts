import { isITrack, ITrack, ITracks } from './ibreakdown';
import { Track } from './track';

export class Tracks {
  static load(audioContext: AudioContext, output: AudioNode, path: string, iTracks: ITracks) {
    let tracks: Track[] = [],
      add = function (track: string | ITrack, group?: string) {
        let filename: string, description: string;
        if (typeof track === "string") {
          filename = `${path}${track.toLowerCase()}.mp3`;
          description = track;
        }
        else {
          filename = `${path}${track.filename}`;
          description = track.description;
        }
        tracks.push(new Track(audioContext, output, filename, description, group));
      };
    iTracks.forEach((track, index, array) => {
      if (typeof track === "string") add(track);
      else if (isITrack(track)) add(track);
      else Object.keys(track).forEach(group => track[group].forEach(t => add(t, group)));
    });
    return new Tracks(tracks);
  }
  constructor(private readonly _tracks: Track[]) {
    this._tracks.forEach((track) => {
      if (track.group !== undefined)
        if (this.groups.indexOf(track.group!) < 0)
          this.groups.push(track.group!);
    });
  }
  readonly groups: string[] = [];
  activate(group?: string) { this._tracks.forEach(track => track.activate(group)); }
  get active() { return this._tracks.filter(track => track.active); }
  setPlaybackRate(rate: number) { this._tracks.forEach(track => track.setPlaybackRate(rate)); }
  play(seconds: number = 0) {
    return new Promise<void>((resolve, reject) => {
      let promises: Promise<void>[] = [];
      this._tracks.forEach(track => promises.push(track.seek(seconds)));
      Promise.all(promises).then(() => {
        promises = [];
        this._tracks.forEach(track => promises.push(track.play()));
        Promise.all(promises).then(() => { resolve(); });
      }, reject);
    });
  }
  pause() {
    return new Promise<void>((resolve, reject) => {
      let promises: Promise<void>[] = [];
      this._tracks.forEach(track => promises.push(track.pause()));
      Promise.all(promises).then(() => { resolve(); });
    });
  }
}
