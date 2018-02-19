import EmberObject, { computed } from '@ember/object';
import { Internal, makeInternalMixin } from '../util/make-internal-mixin';
import { all } from 'rsvp';

export class BaseContextInternal extends Internal {

  constructor(owner, parent) {
    super(owner, parent);
    this.contexts    = this.factoryFor('models:contexts-manager').create({ context: this.owner });
    this.transaction = this.factoryFor('models:transaction-manager').create({ context: this.owner });
    this.queries     = this.factoryFor('models:queries-manager').create({ context: this.owner });
    this.data        = this.factoryFor('models:data-manager').create({ context: this.owner });
    this.documents   = this.factoryFor('models:documents-manager').create({ context: this.owner });
    this.models      = this.factoryFor('models:models-manager').create({ context: this.owner });
    this.operations  = this.factoryFor('models:operations').create({ context: this.owner });
    this.identity  = {
      documents: this.factoryFor('models:documents-identity').create({ context: this.owner }),
      models:    this.factoryFor('models:models-identity').create({ context: this.owner }),
    }
  }

  set firebase(firebase) {
    this._firebase = firebase;
    this.firestore = firebase.firestore();
    this.owner.firebase  = firebase;
    this.owner.firestore = firebase.firestore();
  }

  get firebase() {
    return this._firebase;
  }

  contextWillDestroy(context) {
    this.contexts.removeContext(context);
  }

  destroy() {
    this.parent && this.parent.contextWillDestroy(this.owner);
    this.queries.destroy();
    this.contexts.destroy();
    this.identity.documents.destroy();
    this.identity.models.destroy();
  }

}

export const createContext = ContextInternal => EmberObject.extend(makeInternalMixin(ContextInternal), {

  identifier: null,
  parent: null,

  firebase: null,
  firestore: null,

  absoluteIdentifier: computed('identifier', 'parent.absoluteIdentifier', function() {
    let parent = this.get('parent.absoluteIdentifier');
    let identifier = this.get('identifier');
    if(parent) {
      return `${parent}/${identifier}`;
    }
    return identifier;
  }).readOnly(),

  fork(identifier) {
    return this._internal.contexts.createContext(identifier);
  },

  query(opts) {
    return this._internal.queries.createQuery(opts);
  },

  settle() {
    return all([
      this._internal.operations.settle(),
      this._internal.contexts.settle()
    ]);
  },

  toStringExtension() {
    let identifier = this.get('absoluteIdentifier');
    return `${identifier}`;
  },

  dump(level=0) {
    let contexts = this._internal.contexts.get('contexts');
    let padding = (() => {
      let str = '';
      for(let i = 0; i < level; i++) {
        str = `  ${str}`;
      }
      return str;
    })();

    console.log(`${padding}* ${this.get('identifier')}`);

    let queries = this._internal.queries.get('queries');
    if(queries.length > 0) {
      console.log(`${padding}  § queries`);
      queries.forEach(query => {
        console.log(`${padding}    ${query.opts.id}`);
      });
    }

    let documents = this._internal.identity.documents._storage.all;
    if(documents.length > 0) {
      console.log(`${padding}  § documents`);
      documents.forEach(doc => {
        console.log(`${padding}    ${doc.path}`);
      });
    }

    let models = this._internal.identity.models._storage.all;
    if(models.length > 0) {
      console.log(`${padding}  § models`);
      models.forEach(model => {
        console.log(`${padding}    ${model.model(true)}`);
      });
    }

    contexts.forEach(context => context.dump(level + 1));
  }

});
