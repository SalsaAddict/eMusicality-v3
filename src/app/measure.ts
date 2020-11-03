import { IndexTracker } from './index-tracker';

export type Context = "primary" | "warning" | "danger";
export class Measure {
  constructor(
    readonly index: number,
    readonly startIndex: number,
    readonly framework: string | undefined,
    readonly length: number,
    readonly context: Context,
    readonly isLast: boolean) {
    this.isFirst = index === 0;
    this.endIndex = this.startIndex + this.length - 1;
  }
  readonly isFirst: boolean;
  readonly endIndex: number;
}
