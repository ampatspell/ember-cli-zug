import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';

export default identifier => {
  assert('identifier is required', typeof identifier === 'string');
  identifier = identifier.trim();
  assert('identifier must not be blank', identifier.length > 0);
  return dasherize(identifier);
};
