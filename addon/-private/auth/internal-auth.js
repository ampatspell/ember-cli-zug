import Internal from '../model/internal';
import AuthMethods from './internal-methods';

export default class Auth extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.methods = new AuthMethods(context, this);
  }

  createModel() {
    return this.context.factoryFor('zug:auth').create({ _internal: this });
  }

  willDestroy() {
    this.methods.destroy();
    super.willDestroy();
  }

}
