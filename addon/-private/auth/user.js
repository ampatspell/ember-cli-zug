import EmberObject from '@ember/object';
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
