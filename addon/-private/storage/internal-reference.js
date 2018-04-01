import Internal from '../model/internal';
import firebase from 'firebase';
import { assert } from '@ember/debug';
import Task from './internal-task';

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
  }

  createModel() {
    return this.context.factoryFor('zug:storage/reference').create({ _internal: this });
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

  createInternalTask(type, task) {
    return new Task(this.context, this, type, task);
  }

  put(opts) {
    let { task, type } = this.createStorageTask(opts);
    return this.createInternalTask(type, task);
  }

}
