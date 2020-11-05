import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Track } from '../track';
import { IVolume } from '../utilities';

@Component({
  selector: 'button[emu-volume-button]',
  templateUrl: './volume-button.component.html'
})
export class VolumeButtonComponent {
  @Input("emu-volume-button") track?: Track;
  @Input() volume?: IVolume;
  @Input() fade?: number;
  @HostBinding("class") get buttonClass() { return this.volume! === this.track!.volume ? "btn btn-primary" : "btn btn-outline-primary"; }
  @HostListener("click", ["$event.target"]) onClick() { this.track!.setVolume(this.volume!, this.fade ?? 0); }
}
