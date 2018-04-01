import EmberObject, { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { InternalMixin, promise } from '../model/internal';

const keys = [
  'uid',
  'isAnonymous',
  'displayName',
  'email',
  'emailVerified',
  'phoneNumber',
  'photoURL',
  'providerId'
];

const PropertiesMixin = Mixin.create(keys.reduce((hash, key) => {
  hash[key] = computed(function() {
    return this._internal.user[key];
  }).readOnly();
  return hash;
}, {}));

const serialized = () => computed(...keys, function() {
  return this.getProperties(...keys);
}).readOnly();

const promiseUndefined = name => promise(name, () => undefined);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  serialized: serialized(),

  delete: promiseUndefined('delete'),

});
