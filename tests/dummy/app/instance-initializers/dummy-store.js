import { Promise as RSVPPromise } from 'rsvp';
import registerContextService from 'ember-cli-zug/register-context-service';

export default {
  name: 'dummy:store',
  initialize(app) {
    window.Promise = RSVPPromise;

    app.inject('component', 'router', 'service:router');

    registerContextService(app, {
      modelNameForDocument(document, context) {
        let { collection } = document.getProperties('collection');

        if(context.get('absoluteIdentifier').startsWith('store/crud')) {
          if(collection === 'people') {
            return 'crud/person';
          }
          if(collection === 'blogs') {
            return 'crud/blog';
          }
        }

        if(collection === 'people') {
          return 'person';
        }
        if(collection === 'blogs') {
          return 'blog';
        }

        return 'unknown';
      },
      storeNameForIdentifier(absoluteIdentifier) {
        if(absoluteIdentifier === 'store') {
          return 'store';
        }
      }
    });
  }
};
