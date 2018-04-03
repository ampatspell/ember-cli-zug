import EmberObject from '@ember/object';
import { InternalMixin, model } from '../model/internal';
import { property } from '../model/model-array-proxy';

const tasks = property(internal => internal.tasks);

export default EmberObject.extend(InternalMixin, {

  // running tasks
  tasks: tasks(),

  // { path: ... } or string
  // { url: ... }
  ref: model('ref')

});
