import _destroyable from '../util/destroyable-computed';

const build = (Property, config, opts) => {
  config = config || {};

  let props = {
    create(key) {
      return new Property(this, key, opts);
    },
    reusable(property) {
      return property.isReusable;
    },
    get(property) {
      return property.getValue();
    },
    destroy(property) {
      property.destroy();
    }
  };

  if(config.mutable) {
    props.set = function(property, value) {
      return property.setValue(value);
    }
  }

  return props;
}

export default (Property, config) => opts => _destroyable(build(Property, config, opts));
