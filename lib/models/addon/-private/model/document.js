import EmberObject from '@ember/object';
import { InternalMixin, prop, mut, promise } from './internal';

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),

  id:         mut('id'),
  collection: mut('collection'),
  path:       mut('path'),

  data:       prop('data'),

  // save: promise('save'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let path = this.get('path');
    return `${context}:${path}`;
  }

});
