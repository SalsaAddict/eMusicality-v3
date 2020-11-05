export class Status {
  constructor(readonly iconDelaySeconds: number = 0.5) { }
  private _queue: number[] = [];
  private _showIcon: boolean = false;
  get state() { return this._queue.length > 0; }
  get showIcon() { return this._showIcon; }
  push = () => { this._queue.push(window.setTimeout(() => { this._showIcon = true; }, this.iconDelaySeconds * 500)); }
  pop = () => { window.clearTimeout(this._queue.pop()); if (!this.state) this._showIcon = false; }
}
