import { Component, Input } from '@angular/core';
import { Track } from '../track';
import { IVolume } from '../utilities';

@Component({
  selector: 'emu-tracks',
  templateUrl: './tracks.component.html'
})
export class TracksComponent {
  @Input() tracks?: Track[];
  readonly iVolume: IVolume[] = ["off", "down", "up"];
}
