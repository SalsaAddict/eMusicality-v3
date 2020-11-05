import { Component, Input, OnInit } from '@angular/core';
import { ISong } from '../icatalog';

@Component({
  selector: 'emu-song-header',
  templateUrl: './song-header.component.html'
})
export class SongHeaderComponent implements OnInit {
  ngOnInit() { this.artwork = `${this.path!}artwork.jpg`; }
  @Input() path?: string;
  @Input() song?: ISong;
  artwork?: string;
}
