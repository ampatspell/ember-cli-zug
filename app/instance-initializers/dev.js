import registerStoreService from 'models/register-store-service';

export default {
  name: 'dev',
  initialize(app) {
    app.inject('component', 'store',  'service:store');
    app.inject('component', 'router', 'service:router');
    app.inject('route',     'store',  'service:store');

    let store = registerStoreService(app);

    if(typeof window !== 'undefined') {
      window.store = store;
      app.reopen({
        willDestroy() {
          this._super(...arguments);
          delete window.store;
        }
      });
    }
  }
};
