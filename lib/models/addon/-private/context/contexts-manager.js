import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { array } from '../util/computed';
import { all } from 'rsvp';

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

  settle() {
    return all(this.get('contexts').map(context => context.settle()));
  },

  willDestroy() {
    this.get('contexts').map(context => context.destroy());
    this._super(...arguments);
  }

});
