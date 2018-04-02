import Internal from '../model/internal';
import firebase from 'firebase';
import { assert } from '@ember/debug';
import Task from './internal-task';
import Metadata from './internal-metadata';

const {
  StringFormat
} = firebase.storage;

const stringFormats = {
  'raw':        StringFormat.RAW,
  'base64':     StringFormat.BASE64,
  'base64-url': StringFormat.BASE64URL,
  'data-url':   StringFormat.DATA_URL
};

export default class InternalReference extends Internal {

  constructor(context, storage, ref) {
    super();
    this.context = context;
    this.storage = storage;
    this.ref = ref;
    this._metadata = undefined;
  }

  createModel() {
    return this.context.factoryFor('zug:storage/reference').create({ _internal: this });
  }

  get metadata() {
    let metadata = this._metadata;
    if(!metadata) {
      metadata = new Metadata(this.context, this)
      this._metadata = metadata;
    }
    return metadata;
  }

  createStorageTask(opts) {
    let { type, data, format, metadata } = opts;
    assert(`opts.metadata must be object`, typeof metadata === 'object');
    let task;
    if(type === 'string') {
      let format_ = stringFormats[format];
      assert(`opts.format can be one of the following [ ${Object.keys(stringFormats).join(', ')} ]`, format_);
      task = this.ref.putString(data, format_, metadata);
    } else if(type === 'data') {
      task = this.ref.put(data, metadata);
    } else {
      assert(`opts.type must be string or data`, false);
    }
    return { type, task };
  }

  registerTask(task) {
    this.storage.registerTask(task);
  }

  unregisterTask(task) {
    this.storage.unregisterTask(task);
  }

  createInternalTask(type, task) {
    let internal = new Task(this.context, this, type, task);
    this.registerTask(internal);
    return internal;
  }

  put(opts) {
    let { task, type } = this.createStorageTask(opts);
    return this.createInternalTask(type, task);
  }

  load(opts) {
    return this.metadata.load(opts);
  }

  willDestroy() {
    this._metadata && this._metadata.destroy();
    super.willDestroy();
  }

}
