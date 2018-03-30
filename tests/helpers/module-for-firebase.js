import { module } from 'qunit';
import { resolve } from 'rsvp';
import { run } from '@ember/runloop';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { get } from '@ember/object';

const getter = (object, name, fn) => Object.defineProperty(object, name, { get: () => fn() });

const cached = (object, name, fn) => Object.defineProperty(object, name, {
  get: () => {
    let key = `_${name}`;
    let value = object[key];
    if(!value) {
      value = fn();
      object[key] = value;
    }
    return value;
  }
});

const defaultConfig = {
  apiKey: "AIzaSyApr48AJWch97DybXXVhF53LJttudP8E2Y",
  authDomain: "ember-cli-zug.firebaseapp.com",
  databaseURL: "https://ember-cli-zug.firebaseio.com",
  projectId: "ember-cli-zug",
  storageBucket: "ember-cli-zug.appspot.com",
  messagingSenderId: "102388675337"
};

const firebaseOptions = instance => {
  let env = instance.factoryFor('config:environment').class;
  let config = get(env, 'test.firebase.config');
  return config || defaultConfig;
}

export default function(name, options={}) {
  module(name, {
    beforeEach(...args) {
      this.application = startApp();
      this.instance = this.application.buildInstance();

      this.lookup = name => this.instance.lookup(name);
      this.register = (name, factory) => this.instance.register(name, factory);

      getter(this, 'stores', () => this.lookup('zug:stores'));
      cached(this, 'store', () => this.stores.createContext('store', {
        firebase: firebaseOptions(this.instance),
        firestorePersistenceEnabled: false,
        modelNameForDocument: (doc, context) => this.modelNameForDocument(doc, context)
      }));
      getter(this, 'firestore', () => this.store._internal.firestore);

      return this.store.get('ready').then(() => {
        return resolve(options.beforeEach && options.beforeEach.apply(this, args));
      });
    },
    afterEach() {
      return resolve(options.afterEach && options.afterEach.apply(this, arguments)).then(() => {
        return this.store.settle();
      }).then(() => {
        run(() => this.instance.destroy());
        destroyApp(this.application);
      });
    }
  })
}
