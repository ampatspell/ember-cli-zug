import { assign } from '@ember/polyfills';

export default props => {
  let { app, identifier, opts, modelNameForDocument } = assign({ identifier: 'store' }, props);

  let stores = app.lookup('models:stores');

  let store = stores.createContext(identifier, {
    opts,
    modelNameForDocument
  });

  app.register(`service:${identifier}`, store, { instantiate: false });
  return store;
}
