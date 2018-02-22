import firebase from 'firebase';
import fetch from 'fetch';
import { resolve } from 'rsvp';

const url = '/__/firebase/init.json';

export default (identifier, firestorePersistenceEnabled, opts) => {

  const enableFirestorePersistence = app => {
    if(firestorePersistenceEnabled) {
      return resolve(app.firestore().enablePersistence()).then(() => {}, () => {});
    }
    return resolve();
  };

  const init = opts => {
    let app = firebase.initializeApp(opts, identifier);
    return enableFirestorePersistence(app).then(() => app);
  };

  if(opts) {

    return init(opts);

  } else {

    return fetch(url).then(res => res.json()).then(opts => init(opts));

  }
};
