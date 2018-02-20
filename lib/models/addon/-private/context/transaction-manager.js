import Destroyable from '../model/destroyable';

export default class TransactionManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
  }

  refGet(ref, ...args) {
    return ref.get(...args);
  }

  refSet(ref, ...args) {
    return ref.set(...args).then(() => undefined);
  }

  refDelete(ref) {
    return ref.delete().then(() => undefined);
  }

}
