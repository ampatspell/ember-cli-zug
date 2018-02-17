import { Promise } from 'rsvp';
import { later } from '@ember/runloop';

export const wait = delay => new Promise(resolve => later(resolve, delay));

export const waitFor = async (fn, max=30000) => {
  let start = Date.now();
  for(;;) {
    if(Date.now() - start > max) {
      throw new Error('Timeout');
    }
    let done = await fn();
    if(done) {
      return;
    }
    await wait(100);
  }
};
