import EmberObject from '@ember/object';
import { array } from './util/computed';
import InternalQuery from './internal-query';

export default EmberObject.extend({

  context: null,
  queries: array(),

  createInternalQuery(opts) {
    let context = this.get('context');
    return new InternalQuery(context, this, opts);
  },

  createQuery(opts) {
    let internal = this.createInternalQuery(opts);
    this.get('queries').pushObject(internal);
    return internal.model(true);
  },

  removeQuery(internal) {
    this.get('queries').removeObject(internal);
  },

  willDestroy() {
    this.get('queries').map(query => query.destroy());
    this._super(...arguments);
  }

});
