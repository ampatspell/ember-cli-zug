import property from '../make-property';

import QueryProperty from './query';
import MatchProperty from './match';
import TransientProperty from './transient';
import ForkProperty from './fork';

export const query = property(QueryProperty);
export const match = property(MatchProperty);
export const transient = property(TransientProperty);
export const fork = property(ForkProperty);
