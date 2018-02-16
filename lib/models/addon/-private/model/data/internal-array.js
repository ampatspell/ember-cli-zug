import { A } from '@ember/array';
import InternalData, { typed, empty } from './internal-data';
import { isInternal, toInternal, toModel } from './util';

export default typed(class InternalArray extends InternalData {

  constructor(context, parent) {
    super(context, parent, A());
    this.observing = false;
  }

  createModel() {
    return this.factoryFor('models:data/array').create({ _internal: this, content: this.content });
  }

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

  startObserving() {
    if(this.observing || this.isDetached || !this.model(false)) {
      return;
    }
    this.observing = true;
    this.content.addEnumerableObserver(this, this.valueObserverOptions);
  }

  stopObserving() {
    if(!this.observing) {
      return;
    }
    this.observing = false;
    this.content.removeEnumerableObserver(this, this.valueObserverOptions);
  }

  didDetach() {
    this.stopObserving();
    super.didDetach();
  }

  didAttach() {
    this.startObserving();
    super.didAttach();
  }

  didCreateModel() {
    super.didCreateModel();
    this.startObserving();
  }

  didDestroyModel() {
    this.stopObserving();
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

  deserialize(values, changed, notify) {
    let content = this.content;

    content.forEach(internal => this._detachInternal(internal));
    content.clear();

    let internals = A(values).map(value => {
      let { internal } = this._deserializeValue(value, empty);
      return internal;
    });

    content.addObjects(internals);

    this.didUpdate(notify);
  }

  serialize() {
    return this.content.map(internal => this._serializeValue(internal));
  }

}, 'internal-array');
