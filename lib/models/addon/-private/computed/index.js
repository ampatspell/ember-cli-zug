import property from './make-property';
import QueryProperty from './query';
import AttributeProperty from './attribute';

export const query = property(QueryProperty);
export const attr = property(AttributeProperty, false);
