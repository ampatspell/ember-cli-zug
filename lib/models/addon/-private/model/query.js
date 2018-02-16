import EmberObject from '@ember/object';
import { InternalMixin, prop, promise } from './internal';
import { assign } from '@ember/polyfills';

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),
  identifier: prop('identifier'),

  content: null,

  load: promise('load'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let id = this.get('identifier');
    return `${context}:${id}`;
  },

  dump() {
    let content = this.get('content');
    let json = content.map(doc => assign({}, doc.getProperties('id', 'path'), doc.get('data.serialized')));
    console.table(json);
  }

});
