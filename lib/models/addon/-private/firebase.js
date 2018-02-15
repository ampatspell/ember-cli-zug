import { getOwner } from '@ember/application';
import firebase from 'firebase';

export default {
  create(context) {
    let config = getOwner(context).resolveRegistration('config:environment');
    let app;
    try {
      app = firebase.app();
    } catch(err) {
      app = firebase.initializeApp(config.firebase);
    }
    return app;
  }
};
