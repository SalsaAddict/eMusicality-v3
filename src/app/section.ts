import { Measure } from './measure';
import { IRange } from './utilities';

export class Section implements IRange {
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
