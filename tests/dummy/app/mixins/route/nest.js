import Mixin from '@ember/object/mixin';
import DestroyContext from './destroy-context';

export default Mixin.create(DestroyContext, {

  context: null,

  nest(name) {
    name = name || this.get('context');
    return this.get('store').nest(name);
  }

});
