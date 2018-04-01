import Internal from '../model/internal';
import { createMethod, types } from './methods/registry';

export default class InternalAuthMethods extends Internal {

  constructor(context, auth) {
    super();
    this.context = context;
    this.auth = auth;
    this.methods = Object.create(null);
    this.types = types;
  }

  createModel() {
    return this.context.factoryFor('zug:auth/methods').create({ _internal: this });
  }

  method(name) {
    let internal = this.methods[name];
    if(!internal) {
      internal = createMethod(name, this.context, this.auth);
      if(internal) {
        this.methods[name] = internal;
      }
    }
    return internal;
  }

  willDestroy() {
    for(let key in this.methods) {
      this.methods[key].destroy();
    }
    super.willDestroy();
  }

}