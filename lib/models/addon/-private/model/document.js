import EmberObject from '@ember/object';
import { InternalMixin, prop, promise } from './internal';

export default EmberObject.extend(InternalMixin, {

  context: prop('context'),

  // id:     prop('id'),
  // path:   prop('path'),
  // parent: prop('parent'),
  // data:   prop('data'),

  // save: promise('save'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let path = this.get('path');
    return `${context}:${path}`;
  }

});
