import { module } from 'qunit';
import { resolve } from 'rsvp';
import { run } from '@ember/runloop';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

// const getter = (object, name, fn) => Object.defineProperty(object, name, { get: () => fn() });

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

const opts = {
  "apiKey": "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
  "databaseURL": "https://ohne-zeit.firebaseio.com",
  "storageBucket": "ohne-zeit.appspot.com",
  "authDomain": "ohne-zeit.firebaseapp.com",
  "messagingSenderId": "491555737764",
  "projectId": "ohne-zeit"
};

export default function(name, options={}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.instance = this.application.buildInstance();

      this.lookup = name => this.instance.lookup(name);

      cached(this, 'store', () => this.lookup('models:stores').store('store', opts));

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