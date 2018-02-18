import EmberObject, { computed } from '@ember/object';
import { InternalMixin, internal, prop, mut, promise } from './internal';

const data = () => internal(function(internal) {
  return internal.data.model(true);
});

const serialized = () => computed('id', 'collection', 'path', 'data.serialized', function() {
  let { id, collection, path } = this.getProperties('id', 'collection', 'path', 'data');
  let data = this.get('data.serialized');
  return {
    id,
    collection,
    path,
    data
  };
});

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),

  id:         mut('id'),
  collection: mut('collection'),
  path:       mut('path'),

  data:       data(),
  serialized: serialized(),

  load:       promise('load'),
  save:       promise('save'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let path = this.get('path');
    return `${context}:${path}`;
  }

});
