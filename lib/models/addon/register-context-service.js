import { assign } from '@ember/polyfills';

const toProps = args => {
  let props = args[0];
  if(args.length === 2) {
    let app = args[0];
    props = args[1];
    props = assign({ app }, props);
  }
  return props;
};

export default (...args) => {
  let props = toProps(args);

  let {
    app,
    identifier,
    exportInDevelopment,
    opts,
    modelNameForDocument,
    persistenceEnabled,
    storeNameForIdentifier
  } = assign({ identifier: 'store', exportInDevelopment: true }, props);

  let stores = app.lookup('models:stores');

  let store = stores.createContext(identifier, {
    opts,
    persistenceEnabled,
    modelNameForDocument,
    storeNameForIdentifier
  });

  app.register(`service:${identifier}`, store, { instantiate: false });

  let env = app.factoryFor('config:environment').class;
  let isDevelopment = env.environment === 'development';

  if(exportInDevelopment && isDevelopment && typeof window !== 'undefined') {
    window[identifier] = store;
    app.reopen({
      willDestroy() {
        this._super(...arguments);
        delete window[identifier];
      }
    });
  }

  return store;
}
