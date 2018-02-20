import EmberObject, { computed } from '@ember/object';
import { InternalMixin, internal, prop, mut, promise } from './internal';

const data = () => internal(function(internal) {
  return internal.data.model(true);
});

const serialized = () => computed('id', 'collection', 'path', 'isNew', 'isDirty', 'isSaving', 'isExisting', 'isError', 'error', 'data.serialized', function() {
  let data = this.get('data.serialized');
  let ref = this.getProperties('id', 'path', 'collection');
  let state = this.getProperties('isNew', 'isDirty', 'isSaving', 'isExisting', 'isError', 'error');
  return {
    ref,
    state,
    data
  };
});

const state = () => computed(function(key) {
  return this._internal.state[key];
}).readOnly();

export default EmberObject.extend(InternalMixin, {

  context:    prop('context'),

  id:         mut('id'),
  collection: mut('collection'),
  path:       mut('path'),

  isNew:      state(),
  isDirty:    state(),
  isSaving:   state(),
  isExisting: state(),
  isError:    state(),
  error:      state(),

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
