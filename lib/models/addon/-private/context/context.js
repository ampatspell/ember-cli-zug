import EmberObject from '@ember/object';
import { InternalMixin, prop } from '../model/internal';

//     this.transaction = this.factoryFor('models:transaction-manager').create({ context: this.owner });
//     this.queries     = this.factoryFor('models:queries-manager').create({ context: this.owner });
//     this.documents   = this.factoryFor('models:documents-manager').create({ context: this.owner });
//     this.models      = this.factoryFor('models:models-manager').create({ context: this.owner });
//     this.operations  = this.factoryFor('models:operations').create({ context: this.owner });
//     this.identity  = {
//       documents: this.factoryFor('models:documents-identity').create({ context: this.owner }),
//       models:    this.factoryFor('models:models-identity').create({ context: this.owner }),
//     }

export default EmberObject.extend(InternalMixin, {

  identifier:         prop('identifier'),
  absoluteIdentifier: prop('absoluteIdentifier'),
  ready:              prop('ready'),

  fork(identifier) {
    return this._internal.fork(identifier).model(true);
  },

  // query(opts) {
  //   return this._internal.queries.createQuery(opts);
  // },

  // // { id, collection, path } or `db => db.collection('animals').where('name', '==', 'hamster')`
  // first(selector) {
  //   let context = this._internal;
  //   return context.documents.loadFirstDocument(selector).then(document => context.models.modelForDocument(document).model(true));
  // },

  // settle() {
  //   return all([
  //     this._internal.operations.settle(),
  //     this._internal.contexts.settle()
  //   ]);
  // },

  toStringExtension() {
    let identifier = this.get('absoluteIdentifier');
    return `${identifier}`;
  }

});
