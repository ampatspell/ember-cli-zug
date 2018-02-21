import EmberObject from '@ember/object';
import { InternalMixin, prop, model, promise } from '../model/internal';

export default EmberObject.extend(InternalMixin, {

  identifier:         prop('identifier'),
  absoluteIdentifier: prop('absoluteIdentifier'),
  ready:              prop('ready'),

  // identifier
  fork: model('fork'),

  // { name, id, collection, path, data: { ... } }
  model: model('build'),

  // { name, id, collection, path, create }
  existing: model('existing'),

  // { ... }
  query: model('query'),

  //
  settle: promise('settle'),

  toStringExtension() {
    let identifier = this.get('absoluteIdentifier');
    return `${identifier}`;
  }

});
