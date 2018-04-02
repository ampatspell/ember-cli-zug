import EmberObject from '@ember/object';
import { InternalMixin, model } from '../model/internal';
import { property } from '../model/model-array-proxy';

const tasks = property(internal => internal.tasks);

export default EmberObject.extend(InternalMixin, {

  // running tasks
  tasks: tasks(),

  // { type: 'data', data: ..., metadata: { } }
  // { type: 'string', data: ..., format: 'raw' / 'base64' / 'base64-url' / 'data-url', metadata: {} }
  ref: model('ref')

});
