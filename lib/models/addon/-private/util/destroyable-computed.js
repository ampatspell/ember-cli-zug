import { computed } from '@ember/object';
import { A } from '@ember/array';

const __key__ = '__models_destroyable_computed__';
const __get = owner => owner.willDestroy[__key__];

const _cache = (owner, create) => {
  if(!owner) {
    return;
  }
  if(!owner.willDestroy) {
    return;
  }
  let object = __get(owner);
  if(!object && create) {
    object = Object.create(null);
    let willDestroy = owner.willDestroy;
    owner.willDestroy = function() {
      let object = __get(owner);
      for(let key in object) {
        let { value, destroy } = object[key];
        destroy(value);
      }
      willDestroy.apply(owner, arguments);
    }
    owner.willDestroy[__key__] = object;
  }
  return object;
}

const _retrieve = (owner, key) => {
  let cache = _cache(owner, false);
  if(!cache) {
    return {};
  }
  let value = cache[key];
  if(!value) {
    value = {};
  }
  return value;
}

const _store = (owner, key, value, destroy) => {
  let cache = _cache(owner, true);
  cache[key] = { value, destroy };
}

const _destroy = (owner, key, value, destroy) => {
  let cache = _cache(owner);
  delete cache[key];
  destroy(value);
}

// { ...keys, opts: { reusable, create, get, destroy } }
export default (...args) => {
  let opts = args.pop();
  let keys = A(args).compact();
  return computed(...keys, function(key) {

    let { value, destroy } = _retrieve(this, key);

    if(value && !opts.reusable.call(this, value, key)) {
      _destroy(this, key, value, destroy);
      value = null;
    }

    if(!value) {
      value = opts.create.call(this, key);
      if(value) {
        _store(this, key, value, opts.destroy);
      }
    }

    if(!value) {
      return;
    }

    return opts.get.call(this, value, key);

  }).readOnly();
};
