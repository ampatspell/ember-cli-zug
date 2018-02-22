import _destroyable from '../util/destroyable-computed';

const asFunction = arg => {
  if(typeof arg === 'function') {
    return arg;
  }
  return () => arg;
}

export default Property => {
  return opts => {
    let fn = asFunction(opts);
    return _destroyable({
      reusable(internal) {
        return internal.reusable();
      },
      create(key) {
        return new Property(this, key, fn);
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
