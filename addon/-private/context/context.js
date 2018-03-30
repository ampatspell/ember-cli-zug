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
  nest: model('nest'),

  // { name, id, collection, path, data: { ... } }
  model: model('build'),

  // { name, id, collection, path, create }
  existing: model('existing'),

  // { type, id, query() }
  query: model('query'),

  // { type, model: [], matches() }
  matcher: model('matcher'),

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
