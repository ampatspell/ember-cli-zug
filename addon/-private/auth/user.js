import EmberObject, { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { InternalMixin, promise, propertiesMixin, serialized } from '../model/internal';

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

const PropertiesMixin = propertiesMixin('user', keys);
const promiseUndefined = name => promise(name, () => undefined);

export default EmberObject.extend(InternalMixin, PropertiesMixin, {

  serialized: serialized(keys),

  delete: promiseUndefined('delete'),

});
