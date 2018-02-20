import registerStoreService from 'models/register-store-service';

export default {
  name: 'thing:store',
  initialize(app) {
    app.inject('component', 'store',  'service:store');
    app.inject('component', 'router', 'service:router');
    app.inject('route',     'store',  'service:store');

    let store = registerStoreService({
      app,
      modelNameForDocument(document, store) {
        console.log(document.get('serialized'), store.get('absoluteIdentifier'));
      }
    });

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
