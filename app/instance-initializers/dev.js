import registerStoreService from 'models/register-store-service';

const opts = {
  apiKey: "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
  authDomain: "ohne-zeit.firebaseapp.com",
  projectId: "ohne-zeit",
  storageBucket: ""
};

export default {
  name: 'dev',
  initialize(app) {
    app.inject('component', 'store',  'service:store');
    app.inject('component', 'router', 'service:router');
    app.inject('route',     'store',  'service:store');

    let store = registerStoreService(app, opts);
    window.store = store;
  }
};
