import EmberObject from '@ember/object';
import { InternalMixin, internal, prop, model, promise, invoke } from '../model/internal';

const identity = () => internal(function(key, internal) {
  return internal.identity.models.model(true);
});

export default EmberObject.extend(InternalMixin, {

  identifier:         prop('identifier'),
  absoluteIdentifier: prop('absoluteIdentifier'),
  ready:              prop('ready'),

  identity: identity(),

  // identifier
  fork: model('fork'),

  // { name, id, collection, path, data: { ... } }
  model: model('build'),

  // { name, id, collection, path, create }
  existing: model('existing'),

  // { ... }
  query: model('query'),

  // { id, collection, path, query: q => { ... } }
  load: invoke('load'),

  // { id, collection, path, query: q => { ... }, optional }
  first: invoke('first'),

  //
  settle: promise('settle'),

  // name
  hasModelClassForName: invoke('hasModelClassForName'),

  toStringExtension() {
    let identifier = this.get('absoluteIdentifier');
    return `${identifier}`;
  }

});
