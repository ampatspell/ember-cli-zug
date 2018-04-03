import Component from '@ember/component';
import layout from './template';
import { query } from 'ember-cli-zug/model/computed';
import { all } from 'rsvp';

export default Component.extend({
  layout,

  query: query(function() {
    return {
      type: 'array',
      owner: [],
      id: `all-things`,
      query: db => db.collection('things')
    };
  }),

  actions: {
    add(count) {
      let context = this.get('context');
      let models = [];
      for(let i = 0; i < count; i++) {
        let model = context.model({ name: 'thing', collection: 'things', data: { created_at: new Date(), index: i } });
        models.push(model);
      }
      all(models.map(model => model.save())).then(() => {
        console.log('saved');
      }, err => {
        console.log(err);
      });
    }
  }

});
