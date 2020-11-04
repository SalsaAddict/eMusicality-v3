export class Status {
  private _busy: boolean = false;
  private _showBusyIcon: boolean = false;
  private _busyTimeoutId?: number;
  get busy() { return this._busy; }
  set busy(isBusy: boolean) {
    this._busy = isBusy;
    if (isBusy)
      this._busyTimeoutId = window.setTimeout(() => {
        this._showBusyIcon = true;
      }, 500);
    else if (this._busyTimeoutId !== undefined) {
      window.clearTimeout(this._busyTimeoutId);
      this._showBusyIcon = false;
    }
  }
  unbusy = () => { this.busy = false; }
  get showBusyIcon() { return this._showBusyIcon; }
  playing: boolean = false;
}
