import property from '../make-property';
import AttributeProperty from './attribute';

export {
  id,
  collection,
  path,
  promise
} from './document';

export const attr = property(AttributeProperty, { mutable: true });
