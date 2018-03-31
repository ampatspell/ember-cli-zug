import Internal from '../../model/internal';
import AuthMethods from './internal-method';

export default class InternalMethod extends Internal {

  constructor(context, auth) {
    super();
    this.context = context;
    this.auth = auth;
  }

  createModel() {
    let type = this.type;
    return this.context.factoryFor(`zug:auth/methods/${type}`).create({ _internal: this });
  }

}
