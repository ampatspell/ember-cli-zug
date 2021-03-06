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

const _get = (owner, key, opts) => {
  let { value, destroy } = _retrieve(owner, key);

  if(value && !opts.reusable.call(owner, value, key)) {
    _destroy(owner, key, value, destroy);
    value = null;
  }

  if(!value) {
    value = opts.create.call(owner, key);
    if(value) {
      _store(owner, key, value, opts.destroy);
    }
  }

  return value;
}

export const cacheFor = (owner, key) => _retrieve(owner, key).value;

// { ...keys, opts: { reusable, create, get, set, destroy } }
export default (...args) => {
  let opts = args.pop();
  let keys = A(args).compact();

  let get = function(key) {
    let internal = _get(this, key, opts);
    if(!internal) {
      return;
    }
    return opts.get.call(this, internal, key);
  }

  let set;
  if(opts.set) {
    set = function(key, value) {
      let internal = _get(this, key, opts);
      if(!internal) {
        return;
      }
      return opts.set.call(this, internal, value, key);
    }
  }

  let prop = computed(...keys, { get, set });

  if(!set) {
    prop = prop.readOnly();
  }

  return prop;
};
