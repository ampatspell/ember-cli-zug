import EmberObject from '@ember/object';

export default EmberObject.extend({

  context: null,

  refGet(ref, ...args) {
    return ref.get(...args);
  },

  refSet(ref, ...args) {
    return ref.set(...args).then(() => undefined);
  },

  refDelete(ref) {
    return ref.delete().then(() => undefined);
  }

});
