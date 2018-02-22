import { assign } from '@ember/polyfills';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import Context from '../context/context';
import _destroyable from '../util/destroyable-computed';

const getContext = (owner, key) => {
  assert(`context property is required`, key);
  let context = get(owner, key);
  assert(`'${key}' must be Context instance in ${owner} not ${context}`, Context.detectInstance(context));
  return context;
};

const asFunction = arg => {
  let fn;
  if(typeof arg === 'function') {
    fn = arg;
  } else {
    fn = () => arg;
  }
  return fn;
}

export default config => {
  return opts => {
    let fn = asFunction(opts);
    return _destroyable({
      create(key) {
        let result = assign({ context: 'context' }, fn.call(this, key));
        let context = getContext(this, result.context);
        return config.create.call(this, context, result, key);
      },
      get(internal) {
        return internal && internal.model(true);
      },
      destroy(internal) {
        internal.destroy();
      }
    });
  };
};
