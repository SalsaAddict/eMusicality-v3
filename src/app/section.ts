import { Measures } from './measures';

export class Section {
  constructor(
    readonly index: number,
    readonly description: string,
    readonly measures: Measures,
    readonly startIndex: number,
    readonly endIndex: number,
    readonly isLast: boolean) {
    this.isFirst = index === 0;
  }
  readonly isFirst: boolean;
}
