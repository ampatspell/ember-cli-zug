import _destroyable from '../util/destroyable-computed';

const build = (Property, config, opts) => {
  config = config || {};

  let props = {
    reusable(internal) {
      return internal.reusable();
    },
    create(key) {
      return new Property(this, key, opts);
    },
    get(internal) {
      return internal.getValue();
    },
    destroy(internal) {
      internal.destroy();
    }
  };

  if(config.mutable) {
    props.set = function(internal, value) {
      return internal.setValue(value);
    }
  }

  return props;
}

export default (Property, config) => opts => _destroyable(build(Property, config, opts));
