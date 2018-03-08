import Destroyable from '../model/destroyable';

export default class FastbootManager extends Destroyable {

  constructor(stores, identifier) {
    super();
    this.stores = stores;
    this.identifier = identifier;
    this.fastboot = stores.getOwner().lookup('service:fastboot');
    this.enable();
  }

  get isFastBoot() {
    let fastboot = this.fastboot;
    return fastboot && fastboot.get('isFastBoot');
  }

  defer() {
    return this.stores.settle();
  }

  serialize() {
    return { ok: true };
  }

  deserialize(payload) {
    this.payload = payload;
  }

  enable() {
    let fastboot = this.fastboot;
    if(!fastboot) {
      return;
    }

    let shoebox = fastboot.get('shoebox');
    if(!shoebox) {
      return;
    }

    let manager = this;
    let identifier = this.identifier;

    if(this.isFastBoot) {
      fastboot.deferRendering(this.defer());
      shoebox.put(identifier, {
        get payload() {
          return manager.serialize();
        }
      });
    } else {
      let object = shoebox.retrieve(identifier);
      if(!object) {
        return;
      }
      let payload = object.payload;
      if(!payload) {
        return;
      }
      manager.deserialize(payload);
    }
  }

}
