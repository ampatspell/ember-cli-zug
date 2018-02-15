import EmberObject from '@ember/object';
import { InternalMixin, prop, promise } from './internal';

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),
  identifier: prop('identifier'),

  content: null,

  load: promise('load'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let id = this.get('identifier');
    return `${context}:${id}`;
  }

});
