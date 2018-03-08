import Destroyable from './model/destroyable';

const identifier = 'flame';

export default class FastbootManager extends Destroyable {

  constructor(stores) {
    super();
    this.stores = stores;
    this.fastboot = stores.getOwner().lookup('service:fastboot');
  }

  get isFastBoot() {
    let fastboot = this.fastboot;
    return fastboot && fastboot.get('isFastBoot');
  }

  defer() {
    return this.stores.settle();
  }

  serialize() {
    console.log('serialize');
    return { ok: true };
  }

  deserialize(payload) {
    console.log('deserialize', payload);
  }

  enableFastboot() {
    let fastboot = this.fastboot;
    if(!fastboot) {
      return;
    }

    let shoebox = fastboot.get('shoebox');
    if(!shoebox) {
      return;
    }

    let manager = this;
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
