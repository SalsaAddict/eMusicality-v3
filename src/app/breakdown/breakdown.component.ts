import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song } from '../song';

@Component({
  selector: 'emu-breakdown',
  templateUrl: './breakdown.component.html',
  styles: [
  ]
})
export class BreakdownComponent {

  constructor(route: ActivatedRoute, http: HttpClient) {
    Song.load(http, route.snapshot.params["songId"])
      .then(song => this.song = song);
  }

  song?: Song;

}
