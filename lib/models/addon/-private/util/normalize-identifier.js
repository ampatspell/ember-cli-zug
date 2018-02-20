import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';

export default (identifier, name='identifier') => {
  assert(`${name} is required`, typeof identifier === 'string');
  identifier = identifier.trim();
  assert(`${name} must not be blank`, identifier.length > 0);
  return dasherize(identifier);
};
