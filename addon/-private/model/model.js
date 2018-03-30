import EmberObject, { get, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { InternalMixin, modelprop } from './internal';

const modelType = value => equal('constructor.modelType', value).readOnly();

const constructorProperty = () => computed(function(key) {
  return get(this.constructor, key);
}).readOnly();

export default EmberObject.extend(InternalMixin, {

  context: modelprop('context'),

  modelName: constructorProperty(),
  modelType: constructorProperty(),

  isPersistedModel: modelType('persisted'),
  isTransientModel: modelType('transient'),

}).reopenClass({

  modelName: null,
  modelType: null

});
