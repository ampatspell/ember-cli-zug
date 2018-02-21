import Context from 'models/context';
import { computed } from '@ember/object';

export default Context.extend({

  // people: model({
  //   name: 'people',
  //   path: '-/people',
  //   create: true
  // }),

  people: computed(function() {
    return this._internal.modelsManager.existingInternalModel({ name: 'people', path: '-/people', create: true }).model(true);
  })

});
