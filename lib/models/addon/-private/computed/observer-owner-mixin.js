import ObjectObserver from './object-observer';

export default Class => class OwnerObserverMixin extends Class {

  get ownerObservationKeys() {
    return this.opts.owner;
  }

  willReset() {
    let observer = this._observer;
    observer && observer.destroy();
    this._observer = null;
    super.willReset();
  }

  valueForOwnerKeyDidChange(key) {
    this.reset();
  }

  observer(create) {
    let observer = this._observer;
    if(!observer && create) {
      observer = new ObjectObserver(this.owner, this.ownerObservationKeys, {
        onChange: key => this.valueForOwnerKeyDidChange(key)
      });
      this._observer = observer;
    }
    return observer;
  }

  didCreateInternalModel() {
    super.didCreateInternalModel();
    this.observer(true).start();
  }

  willDestroy() {
    let observer = this._observer;
    observer && observer.destroy();
    super.willDestroy();
  }

}
