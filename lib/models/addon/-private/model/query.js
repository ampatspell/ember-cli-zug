import EmberObject from '@ember/object';
import { InternalMixin, prop, modelprop, promise, state } from './internal';

export default EmberObject.extend(InternalMixin, {

  context:    modelprop('context'),
  id:         prop('id'),

  isLoading:  state(),
  isLoaded:   state(),
  isError:    state(),
  error:      state(),

  content:    null,

  load: promise('load'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let id = this.get('identifier');
    return `${context}:${id}`;
  }

});
