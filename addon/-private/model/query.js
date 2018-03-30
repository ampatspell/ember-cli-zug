import EmberObject from '@ember/object';
import { InternalMixin, prop, modelprop, promise, state } from './internal';

export default EmberObject.extend(InternalMixin, {

  context:    modelprop(),
  id:         prop(),
  type:       prop(),
  content:    prop(),
  metadata:   prop(),

  isLoading:  state(),
  isLoaded:   state(),
  isError:    state(),
  error:      state(),

  load: promise('load'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let id = this.get('id');
    return `${context}:${id}`;
  }

});
