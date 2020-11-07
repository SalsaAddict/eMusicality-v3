import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song } from '../song';
import { Clock } from '../clock';

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
    Song.load(this._audioContext, this._gainNode, http, route.snapshot.params["songId"])
      .then((song) => {
        this.song = song;
        this.clock = new Clock(this._audioContext, this.song!);
      });
  } song?: Song; clock?: Clock;
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
  private readonly _gainNode: GainNode;
  async play() {
    await this._resume();
    await this.song!.play(this.clock!.seconds);
    this.clock!.start();
  }
  async pause() {
    this.clock!.stop();
    await this.song!.pause();
    await this._suspend();
  }
}
