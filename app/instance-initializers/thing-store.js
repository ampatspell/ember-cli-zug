import registerContextService from 'models/register-context-service';

export default {
  name: 'thing:store',
  initialize(app) {
    app.inject('component', 'router', 'service:router');

    registerContextService({
      app,
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
