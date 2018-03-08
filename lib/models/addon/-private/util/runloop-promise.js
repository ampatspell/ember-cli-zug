import { Promise } from 'rsvp';
import { schedule } from '@ember/runloop';

export const afterRender = () => new Promise(resolve => schedule('afterRender', () => resolve()));
