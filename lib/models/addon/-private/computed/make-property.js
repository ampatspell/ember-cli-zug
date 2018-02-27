import _destroyable from '../util/destroyable-computed';

const asFunction = arg => {
  if(typeof arg === 'function') {
    return arg;
  }
  return () => arg;
}

export default (Property, optsAreFunction=true) => {
  return opts => {
    let arg = optsAreFunction ? asFunction(opts) : opts;
    return _destroyable({
      reusable(internal) {
        return internal.reusable();
      },
      create(key) {
        return new Property(this, key, arg);
      },
      get(internal) {
        return internal.model(true);
      },
      destroy(internal) {
        internal.destroy();
      }
    });
  };
};
