export default class Destroyable {

  constructor() {
    this.isDestroyed = false;
  }

  willDestroy() {
  }

  destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this.willDestroy();
  }

}
