import { Promise as RSVPPromise } from 'rsvp';

export default {
  name: 'dummy:injections',
  initialize(app) {
    window.Promise = RSVPPromise;
    app.inject('component', 'router', 'service:router');
  }
};
