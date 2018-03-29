import Context from 'ember-cli-zug/context';
import { computed } from '@ember/object';

export default Context.extend({

  // people: model({
  //   name: 'people',
  //   path: '-/people',
  //   create: true
  // }),

  people: computed(function() {
    return this.existing({ path: 'singleton/people', name: 'people', create: true });
  })

});
