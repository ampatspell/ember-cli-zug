import Model from 'ember-cli-zug/model/transient';
import { resolve } from 'rsvp';

export default Model.extend({

  ready() {
    return this.get('context.ready');
  },

  message() {
    let context = this.get('context');
    return context.first({ path: 'messages/hello', optional: true }).then(model => model.update());
  },

  info(message) {
    // eslint-disable-next-line no-console
    console.log([
      'Hey there',
      'this is ember-cli-zug default blueprint speaking',
      '',
      'so, I added:',
      ' * app/models/state.js',
      ' * app/models/message.js',
      ' * app/routes/application.js',
      ' * app/instance-initializers/<%= dasherizedPackageName %>-store.js',
      '',
      'and inserted a dummy message document in firestore:',
      `${message}`,
      '',
      `${JSON.stringify(message.get('doc.data.serialized'), null, 2)}`
    ].join('\n'));
  },

  restore() {
    return resolve()
      .then(() => this.ready())
      .then(() => this.message())
      .then(message => this.info(message))
      .then(() => this);
  }

});
