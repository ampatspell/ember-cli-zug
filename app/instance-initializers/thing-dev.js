export default {
  name: 'thing:dev',
  after: 'thing:store',
  initialize(app) {
    let stores = app.lookup('models:stores');
    let fastboot = stores._internal.fastbootManager;
    if(!fastboot.isFastBoot) {
      window.shoebox = fastboot.payload;
    }
  }
};
