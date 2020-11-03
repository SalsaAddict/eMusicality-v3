export class IndexTracker {
  add(length: number) {
    this._length = length;
    this._startIndex = (this._endIndex ?? 0) + 1;
    this._endIndex = this._startIndex! + length - 1;
  }
  private _length: number = 0;
  get length() { return this._length; }
  private _startIndex?: number;
  get startIndex() { return this._startIndex; }
  private _endIndex?: number;
  get endIndex() { return this._endIndex; }
}
