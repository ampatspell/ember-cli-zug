import firebase from 'firebase';
import { resolve } from 'rsvp';

const url = '/__/firebase/init.json';

export default (identifier, persistenceEnabled, opts) => {

  const enablePersistence = app => {
    if(persistenceEnabled) {
      return resolve(app.firestore().enablePersistence()).then(() => {}, () => {});
    }
    return resolve();
  };

  const init = opts => {
    let app = firebase.initializeApp(opts, identifier);
    return enablePersistence(app).then(() => app);
  };

  if(opts) {

    return init(opts);

  } else {

    /* global fetch */
    return fetch(url).then(res => res.json()).then(opts => init(opts));

  }
};
