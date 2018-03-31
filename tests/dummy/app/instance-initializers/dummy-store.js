import registerContextService from 'ember-cli-zug/register-context-service';

const modelNameForDocument = (document, context) => {
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
};

const storeNameForIdentifier = absoluteIdentifier => {
  if(absoluteIdentifier === 'store') {
    return 'store';
  }
};

export default {
  name: 'dummy:store',
  initialize(app) {

    registerContextService(app, {
      app,
      modelNameForDocument,
      storeNameForIdentifier
    });

  }
};
