import { assign } from '@ember/polyfills';
import toProps from './to-props';
import exportInDevelopment from './export-in-development';

// let store = registerContextService({
//   app,
//   identifier: 'store',
//   firebase: { ... }
//   firestorePersistenceEnabled: true,
//   exportServiceInDevelopment: true,
//   injectService: true,
//   injectServiceAs: 'store',
//   injectServiceInto: [ 'route', 'controller', 'component' ],
//   modelNameForDocument(document, store) {
//     let { collection } = document.getProperties('collection');
//     if(collection === 'people') {
//       return 'person';
//     }
//   },
//   storeNameForIdentifier(absoluteIdentifier, identifier) {
//     if(absoluteIdentifier === 'store') {
//       return 'store';
//     }
//   }
// });
export default (...args) => {
  let props = toProps(args);

  let {
    app,
    identifier,
    firebase,
    firestorePersistenceEnabled,
    exportServiceInDevelopment,
    modelNameForDocument,
    storeNameForIdentifier,
    injectService,
    injectServiceAs,
    injectServiceInto
  } = assign({ identifier: 'store', injectService: true, exportServiceInDevelopment: true }, props);


  // create context

  let stores = app.lookup('zug:stores');

  let store = stores.createContext(identifier, {
    firebase,
    firestorePersistenceEnabled,
    modelNameForDocument,
    storeNameForIdentifier
  });


  // register service

  let factoryName = `service:${identifier}`;

  app.register(factoryName, store, { instantiate: false });


  // inject service

  if(injectService) {
    injectServiceAs = injectServiceAs || identifier;
    injectServiceInto = injectServiceInto || [ 'route', 'controller', 'component' ];
    injectServiceInto.forEach(target => app.inject(target, injectServiceAs, factoryName));
  }


  // export global

  if(exportServiceInDevelopment) {
    exportInDevelopment(app, identifier, store);
  }


  return store;
}
