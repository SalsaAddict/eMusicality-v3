import { Component, Input, OnInit } from '@angular/core';
import { Section } from '../section';
import { Song } from '../song';
import { inRange } from '../utilities';

@Component({
  selector: 'emu-progress-bar',
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() song?: Song;
  @Input() beats?: number;
  width(section: Section) { return `${(section.length / this.song!.endIndex * 100).toFixed(2)}%`; }
  progress(section?: Section) {
    if (this.beats === undefined || section === undefined) return "0%";
    if (this.beats! < section!.startIndex) return "0%";
    if (this.beats! > section!.endIndex) return "100%";
    return `${((this.beats! - section!.startIndex) / section!.length * 100).toFixed(2)}%`;
  }
  complete(section: Section) { return this.beats! > section.endIndex; }
}
