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
  "apiKey": "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
  "databaseURL": "https://ohne-zeit.firebaseio.com",
  "storageBucket": "ohne-zeit.appspot.com",
  "authDomain": "ohne-zeit.firebaseapp.com",
  "messagingSenderId": "491555737764",
  "projectId": "ohne-zeit"
};

const firebaseOptions = instance => {
  let env = instance.factoryFor('config:environment').class;
  let config = get(env, 'test.firebase.config');
  return config || defaultConfig;
}

export default function(name, options={}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.instance = this.application.buildInstance();

      this.lookup = name => this.instance.lookup(name);
      this.register = (name, factory) => this.instance.register(name, factory);

      getter(this, 'stores', () => this.lookup('models:stores'));
      cached(this, 'store', () => this.stores.createContext('store', {
        firebase: firebaseOptions(this.instance),
        modelNameForDocument: (doc, context) => this.modelNameForDocument(doc, context)
      }));
      getter(this, 'firestore', () => this.store._internal.firestore);

      let beforeEach = options.beforeEach && options.beforeEach.apply(this, arguments);
      return resolve(beforeEach);
    },
    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return resolve(afterEach).then(() => {
        run(() => this.instance.destroy());
        destroyApp(this.application);
      });
    }
  })
}
