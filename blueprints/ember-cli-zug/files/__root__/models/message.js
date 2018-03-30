import Model from 'ember-cli-zug/model/persisted';
import { id, attr, promise } from 'ember-cli-zug/model/persisted/computed';

export default Model.extend({

  id: id(),
  message: attr(),
  author: attr(),

  save: promise('save'),

  update() {
    this.setProperties({
      message: 'To whom it may concern: It is springtime. It is late afternoon.',
      author: 'Kurt Vonnegut'
    });
    return this.save();
  }

});
