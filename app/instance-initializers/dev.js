export default {
  name: 'dev',
  initialize(app) {
    app.inject('component', 'store',  'service:store');
    app.inject('component', 'router', 'service:router');
    app.inject('route',     'store',  'service:store');

    let store    = app.lookup('service:store');
    let firebase = app.lookup('service:firebase');

    window.store    = store;
    window.firebase = firebase;
  }
};
