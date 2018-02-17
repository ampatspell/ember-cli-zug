import { A } from '@ember/array';
import InternalData, { typed } from './internal-data';
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
    A(removing).forEach(internal => this.detachInternal(internal));
  }

  contentDidChange(array, removeCount, adding) {
    A(adding).forEach(internal => this.attachInternal(internal));
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
        this.attachInternal(value);
        return value;
      } else {
        value = value.serialize();
      }
    }
    return this.toAttachable(value);
  }

  toModel(internal) {
    return toModel(internal);
  }

  deserialize(values) {
    let content = this.content;

    content.forEach(internal => this.detachInternal(internal));
    content.clear();

    let internals = A(values).map(value => this.toAttachable(value));
    content.addObjects(internals);
  }

  serialize() {
    return this.content.map(internal => this.serializeInternal(internal));
  }

}, 'internal-array');
