import { A } from '@ember/array';
import InternalData, { typed, empty } from './internal-data';
import { isInternal, toInternal, toModel } from './util';

export default typed(class InternalArray extends InternalData {

  constructor(context, parent) {
    super(context, parent, A());
  }

  createModel() {
    return this.factoryFor('models:data/array').create({ _internal: this, content: this.content });
  }

  // TODO: this leaks on remove
  get valueObserverOptions() {
    return {
      willChange: this.contentWillChange,
      didChange: this.contentDidChange
    };
  }

  contentWillChange(array, removing) {
    A(removing).forEach(internal => this._detachInternal(internal));
  }

  contentDidChange(array, removeCount, adding) {
    A(adding).forEach(internal => this._attachInternal(internal));
    this.didUpdate(true);
  }

  didCreateModel() {
    super.didCreateModel();
    this.content.addEnumerableObserver(this, this.valueObserverOptions);
  }

  didDestroyModel() {
    this.content.removeEnumerableObserver(this, this.valueObserverOptions);
    super.didDestroyModel();
  }

  toInternal(value) {
    value = toInternal(value);

    if(isInternal(value)) {
      if(value.isDetached) {
        return value;
      } else {
        value = value.serialize();
      }
    }

    let { internal } = this._deserializeValue(value, empty);
    return internal;
  }

  toModel(internal) {
    return toModel(internal);
  }

  deserialize(values) {
    let content = this.content;

    content.forEach(internal => this._detach(internal));
    content.clear();

    let internals = A(values).map(value => {
      let { internal } = this._deserializeValue(value, empty);
      return internal;
    });

    content.addObjects(internals);
  }

  serialize() {
    return this.content.map(internal => this._serializeValue(internal));
  }

}, 'internal-array');
