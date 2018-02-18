import Reference from './reference';

export default class PersistedReference extends Reference {

  constructor(ref) {
    super();
    this._ref = ref;
  }

  get id() {
    return this._ref.id;
  }

  get collection() {
    return this._ref.parent.path;
  }

  get path() {
    return this._ref.path;
  }

  willDestroy() {
    this._ref = null;
    super.willDestroy();
  }

}
