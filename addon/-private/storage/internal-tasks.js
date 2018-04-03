import { A } from '@ember/array';
import Internal from '../model/internal';

export default class InternalTasks extends Internal {

  constructor(context) {
    super();
    this.context = context;
    this.running = A();
  }

  createModel() {
    return this.context.factoryFor('zug:storage/tasks').create({ content: this.running });
  }

  register(task) {
    this.running.pushObject(task);
  }

  unregister(task) {
    this.running.removeObject(task);
  }

  willDestroy() {
    this.running.forEach(task => task.destroy());
    super.willDestroy();
  }

}
