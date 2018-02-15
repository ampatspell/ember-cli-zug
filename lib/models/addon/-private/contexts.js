import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { array } from './util/computed';

export default EmberObject.extend({

  context: null,
  contexts: array(),

  createContext(identifier) {
    let parent = this.get('context');
    let context = getOwner(this).factoryFor('models:context').create({ parent, identifier });
    this.get('contexts').pushObject(context);
    return context;
  },

  removeContext(context) {
    this.get('contexts').removeObject(context);
  },

  willDestroy() {
    this.get('contexts').map(context => context.destroy());
    this._super(...arguments);
  }

});
