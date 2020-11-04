import { Measure } from './measure';

export class Section {
  constructor(
    readonly index: number,
    readonly description: string,
    readonly measures: Measure[],
    readonly startIndex: number,
    readonly endIndex: number,
    readonly isLast: boolean) {
    this.isFirst = index === 0;
    this.length = this.endIndex - this.startIndex + 1;
  }
  readonly isFirst: boolean;
  readonly length: number;
}
