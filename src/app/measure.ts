import { IStartIndex } from './song';
import { IRange } from './utilities';

export type Context = "primary" | "warning" | "danger";
export class Measure implements IRange {
  constructor(
    readonly index: number,
    startIndex: IStartIndex,
    readonly framework: string | undefined,
    readonly length: number,
    readonly context: Context,
    readonly isLast: boolean) {
    this.isFirst = index === 0;
    this.startIndex = startIndex.startIndex;
    this.endIndex = this.startIndex + this.length - 1;
    for (let i = 1; i <= length; i++) this.beats.push(i);
    startIndex.startIndex += length;
  }
  readonly isFirst: boolean;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly beats: number[] = [];
}
