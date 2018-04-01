import registerContextService from 'ember-cli-zug/register-context-service';
import registerModelService from 'ember-cli-zug/register-model-service';

let firebase = {
  // projectId: '',
  // apiKey: '',
  // authDomain: '',
  // databaseURL: '',
  // storageBucket: ''
};

if(!firebase.projectId) {
  // eslint-disable-next-line no-console
  console.log([
    'No Firebase config provided.',
    'get your Firebase project configuration from https://console.firebase.google.com/',
    'and add it to app/instance-initializers/<%= dasherizedPackageName %>-store.js',
  ].join('\n'));
}

let modelNameForDocument = document => {
  if(document.get('collection') === 'messages') {
    return 'message';
  }
};

let restoreUser = (user, context) => {};

export default {
  name: '<%= dasherizedPackageName %>:store',
  initialize(app) {

    // register root context as a 'store' service
    let store = registerContextService({
      app,
      firebase,
      modelNameForDocument,
      restoreUser
    });

    // create transient model in root context and register it as a `state` service
    registerModelService({
      app,
      store,
      name: 'state'
    });

  }
};
