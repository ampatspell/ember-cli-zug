import EmberObject from '@ember/object';
import { InternalMixin, internal, prop, mut, promise } from './internal';

const data = () => internal(function(internal) {
  return internal.data.model(true);
});

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),

  id:         mut('id'),
  collection: mut('collection'),
  path:       mut('path'),

  data:       data(),

  save:       promise('save'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let path = this.get('path');
    return `${context}:${path}`;
  }

});
