import registerContextService from 'models/register-context-service';

export default {
  name: 'thing:store',
  initialize(app) {
    app.inject('component', 'router', 'service:router');

    app.inject('component', 'store',  'service:store');
    app.inject('route',     'store',  'service:store');

    registerContextService(app, {
      // exportInDevelopment: false,
      // persistenceEnabled: false,
      modelNameForDocument(document /*, store */) {
        let { collection } = document.getProperties('collection');
        if(collection === 'people') {
          return 'person';
        }
      },
      storeNameForIdentifier(absoluteIdentifier) {
        if(absoluteIdentifier === 'store') {
          return 'store';
        }
      }
    });
  }
};
