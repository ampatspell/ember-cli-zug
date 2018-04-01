import Internal from '../model/internal';
import { resolve } from 'rsvp';

export default class InternalTask extends Internal {

  constructor(context, reference, type, task) {
    super();
    this.context = context;
    this.reference = reference;
    this.type = type;
    this.task = task;
    this.promise = resolve(task);
  }

  createModel() {
    return this.context.factoryFor('zug:storage/task').create({ _internal: this });
  }

}
