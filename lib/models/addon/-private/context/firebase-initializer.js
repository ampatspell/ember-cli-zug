import firebase from 'firebase';
import { resolve } from 'rsvp';

const url = '/__/firebase/init.json';

export default (identifier, opts) => {

  const init = opts => firebase.initializeApp(opts, identifier);

  if(opts) {

    return {
      then(fn) {
        fn(init(opts));
        return resolve();
      }
    };

  } else {

    /* global fetch */
    return fetch(url).then(res => res.json()).then(opts => init(opts));

  }
};
