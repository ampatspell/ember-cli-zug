import EmberObject from '@ember/object';
import { InternalMixin, prop, modelprop } from './internal';

export default EmberObject.extend(InternalMixin, {

  context:    modelprop('context'),
  type:       prop('type'),
  content:    prop('content'),

  toStringExtension() {
    let context = this.get('context.absoluteIdentifier');
    let type = this.get('type');
    return `${context}:${type}`;
  }

});
