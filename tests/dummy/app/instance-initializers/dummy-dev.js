import firebase from 'firebase';
import { all } from 'rsvp';

const playground = async store => {
  let app = store.get('app');
  let functions = app.functions();
  let fn = functions.httpsCallable('callable');
  let result = await all([
    fn({ hello: 'world' }),
    fn({ hello: 'world' })
  ]);
  console.log(result);
};

export default {
  name: 'dummy:dev',
  after: 'dummy:store',
  initialize(app) {
    let store = app.lookup('service:store');
    store.get('ready').then(() => playground(store));
  }
};
