import { assign } from '@ember/polyfills';
import toProps from './to-props';
import exportInDevelopment from './export-in-development';

// let model = registerModelService({
//   app,
//   store,
//   name: 'state'
//   registerAs: 'state',
//   injectService: true,
//   injectServiceAs: 'state',
//   injectServiceInto: [ 'route', 'controller', 'component' ],
//   exportServiceInDevelopment: true,
// });
export default (...args) => {
  let props = toProps(args);

  let {
    app,
    store,
    name,
    registerAs,
    injectService,
    injectServiceAs,
    injectServiceInto,
    exportServiceInDevelopment,
  } = assign({ injectService: true, exportServiceInDevelopment: true }, props);

  registerAs = registerAs || name;
  let factoryName = `service:${registerAs}`;

  // create model

  let model = store.existing({ name, path: `service/${registerAs}`, create: true });


  // register service

  app.register(factoryName, model, { instantiate: false });


  // inject service

  if(injectService) {
    injectServiceAs = injectServiceAs || registerAs;
    injectServiceInto = injectServiceInto || [ 'route', 'controller', 'component' ];
    injectServiceInto.forEach(target => app.inject(target, injectServiceAs, factoryName));
  }


  // export global

  if(exportServiceInDevelopment) {
    exportInDevelopment(app, registerAs, model);
  }


  return model;
}
