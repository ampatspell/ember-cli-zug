import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';

export class Internal {

  constructor(owner, parent) {
    this.owner = owner;
    this.parent = parent;
  }

  getOwner() {
    return getOwner(this.owner);
  }

  factoryFor(name) {
    return this.getOwner().factoryFor(name);
  }

  destroy() {
  }

}

export const makeInternalMixin = Class => Mixin.create({

  init() {
    this._super(...arguments);
    this._internal = new Class(this);
  },

  willDestroy() {
    this._internal.destroy();
    this._super(...arguments);
  }

});
