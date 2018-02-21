import { assign } from '@ember/polyfills';

export default props => {
  let { app, identifier, opts, modelNameForDocument, storeNameForIdentifier } = assign({ identifier: 'store' }, props);

  let stores = app.lookup('models:stores');

  let store = stores.createContext(identifier, {
    opts,
    modelNameForDocument,
    storeNameForIdentifier
  });

  app.register(`service:${identifier}`, store, { instantiate: false });
  return store;
}
