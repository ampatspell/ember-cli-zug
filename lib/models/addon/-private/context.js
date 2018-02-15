import EmberObject, { computed } from '@ember/object';
import { Internal, makeInternalMixin } from './util/make-internal-mixin';
import firebase from 'firebase';

class ContextInternal extends Internal {

  constructor(owner) {
    super(owner, owner.parent && owner.parent._internal);

    if(owner.parent) {
      this.firebase  = owner.parent._internal.firebase;
    } else {
      this.firebase = firebase.initializeApp(this.owner.opts, this.owner.identifier);
    }

    this.firestore = this.firebase.firestore();
    this.contexts  = this.factoryFor('models:contexts').create({ context: this.owner });
    this.queries   = this.factoryFor('models:queries').create({ context: this.owner });
    this.documents = this.factoryFor('models:documents').create({ context: this.owner });

    owner.firebase  = this.firebase;
    owner.firestore = this.firestore;
  }

  contextWillDestroy(context) {
    this.contexts.removeContext(context);
  }

  destroy() {
    this.parent && this.parent.contextWillDestroy(this.owner);
    this.queries.destroy();
    this.contexts.destroy();
  }

}

const InternalMixin = makeInternalMixin(ContextInternal);

export default EmberObject.extend(InternalMixin, {

  identifier: null,
  parent: null,

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
    queries.forEach(query => {
      console.log(`${padding}  § ${query.opts.id}`);
    });
    contexts.forEach(context => context.dump(level + 1));
  }

});
