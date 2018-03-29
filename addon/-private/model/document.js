import EmberObject, { computed } from '@ember/object';
import { InternalMixin, internal, prop, modelprop, mut, promise, state } from './internal';

const data = () => internal(function(key, internal) {
  return internal.data.model(true);
});

let keys = {
  ref:   [ 'id', 'collection', 'path' ],
  state: [ 'isNew', 'isDirty', 'isLoaded', 'isExisting', 'isLoading', 'isSaving', 'isError', 'error' ]
};

const serialized = () => computed(...keys.ref, ...keys.state, 'data.serialized', function() {
  let data = this.get('data.serialized');
  let ref = this.getProperties(...keys.ref);
  let state = this.getProperties(...keys.state);
  return {
    ref,
    state,
    data
  };
}).readOnly();

export default EmberObject.extend(InternalMixin, {

  context:    modelprop(),

  id:         mut(),
  collection: mut(),
  path:       mut(),

  isNew:      state(),
  isDirty:    state(),
  isLoaded:   state(),
  isLoading:  state(),
  isSaving:   state(),
  isExisting: state(),
  isError:    state(),
  error:      state(),

  metadata:   prop(),
  data:       data(),
  serialized: serialized(),

  load:       promise('load'),
  save:       promise('save'),
  delete:     promise('delete'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let path = this.get('path');
    return `${context}:${path}`;
  }

});
