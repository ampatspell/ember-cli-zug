import { A } from '@ember/array';
import { assign } from '@ember/polyfills';

export default ({defaults, computed, extend }) => {

  computed = computed || [];

  const stored = A(Object.keys(defaults));
  const keys = [ ...computed, ...stored ];

  class BaseState {
    constructor() {
      assign(this, defaults);
    }

    set(props, changed) {
      let any = false;
      for(let key in props) {
        let value = props[key];
        if(this[key] !== value) {
          this[key] = value;
          changed(key);
          any = true;
        }
      }
      if(any) {
        changed('state');
      }
    }

    get() {
      return keys.reduce((obj, key) => {
        obj[key] = this[key];
        return obj;
      }, {});
    }

  }

  const State = extend(BaseState);

  return { keys, State };
};
