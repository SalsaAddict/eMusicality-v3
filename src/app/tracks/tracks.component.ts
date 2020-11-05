import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../track';
import { IVolume } from '../utilities';

@Component({
  selector: 'emu-tracks',
  templateUrl: './tracks.component.html'
})
export class TracksComponent implements OnInit {
  ngOnInit() {

  }
  @Input() tracks?: Track[];
  readonly volumes: IVolume[] = ["off", "down", "up"];
  setVolume(track: Track, volume: IVolume) {
    let value;
    switch (volume) {
      case "off": value = 0; break;
      case "up": value = 1; break;
      default: value = 0.5; break;
    }
    track.setVolume(value, 3);
  }
  volumeIconClass(volume: IVolume) { return `fa-volume-${volume}`; }
  volumeButtonClass(track: Track, volume: IVolume) {
    let selected: boolean;
    switch (track.volume) {
      case 0: selected = (volume === "off"); break;
      case 1: selected = (volume === "up"); break;
      default: selected = (volume === "down"); break;
    }
    return selected ? "btn-primary" : "btn-outline-primary";
  }
}
