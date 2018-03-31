import EmberObject, { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { InternalMixin } from '../model/internal';

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

// metadata: creationTime, lastSignInTime
// providerData

export default EmberObject.extend(InternalMixin, PropertiesMixin, {
});
