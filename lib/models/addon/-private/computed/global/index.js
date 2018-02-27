import property from '../make-property';
import QueryProperty from './query';
import MatchProperty from './match';

export const query = property(QueryProperty);
export const match = property(MatchProperty);
