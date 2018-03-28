import property from '../make-property';

import QueryProperty from './query';
import MatchProperty from './match';
import TransientProperty from './transient';
import NestProperty from './nest';

export const query = property(QueryProperty);
export const match = property(MatchProperty);
export const transient = property(TransientProperty);
export const nest = property(NestProperty);
