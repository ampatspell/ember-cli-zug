import firebase from 'firebase';
import { resolve } from 'rsvp';

const url = '/__/firebase/init.json';

export default ({ identifier, opts, ready }) => {
  const init = opts => {
    ready(firebase.initializeApp(opts, identifier));
    return resolve();
  };

  let promise;
  if(opts) {
    promise = init(opts);
  } else {
    /* global fetch */
    promise = fetch(url).then(res => res.json()).then(opts => init(opts));
  }

  return promise;
};
