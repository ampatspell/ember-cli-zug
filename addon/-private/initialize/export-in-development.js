export default (app, identifier, value) => {
  let env = app.factoryFor('config:environment').class;
  let isDevelopment = env.environment === 'development';
  
  /* global window */
  if(isDevelopment && typeof window !== 'undefined') {
    window[identifier] = value;
    app.reopen({
      willDestroy() {
        this._super(...arguments);
        delete window[identifier];
      }
    });
  }
}
