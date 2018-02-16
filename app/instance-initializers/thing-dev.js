import registerStoreService from 'models/register-store-service';

export default {
  name: 'thing:dev',
  after: 'thing:store',
  initialize(app) {
    // let store = app.lookup('service:store');
  }
};
