import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song } from '../song';

@Component({
  selector: 'emu-breakdown',
  templateUrl: './breakdown.component.html'
})
export class BreakdownComponent {
  constructor(route: ActivatedRoute, http: HttpClient) {
    this._audioContext = new AudioContext();
    this._gainNode = this._audioContext.createGain();
    this._gainNode.connect(this._audioContext.destination);
    this._gainNode.gain.value = 1;
    Song.load(http, route.snapshot.params["songId"]).then(song => this.song = song);
  }
  private readonly _audioContext: AudioContext;
  private readonly _gainNode: GainNode;
  song?: Song;
}
