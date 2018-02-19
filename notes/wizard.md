# Wizard

kickoff

``` javascript
// routes/email-series/edit.js
// destroy context mixin destroys context associated with this.currentModel on deactivate
export default Route.extend(DestroyContextMixin, {

  contextName: 'wizard',

  model() {
    let id = this.modelFor('email-series').get('id'); // need to create model in forked context
    // gets a parent context / root store
    // forks a nested context
    // creates transient model with props
    return this.get('store').fork('wizard').model('wizards/email-series', { opts: { id } }).load();
  }

});
```

``` javascript
// models/wizards/email-series.js
export default TransientModel.extend({

  // context: null, // provided by model, points to `store/wizard` context

  opts: null, // { id }

  emailSeries: loader(function() {
    return {

    };
  }),



  async load() {
    return this;
  }

});
```

``` javascript
export default PersistedModel.extend({

  // context: null, // provided by model, points to `store/wizard` context here
  // doc: // { id: 'ioq1wu3re', collection: 'users/{user_id}/email-series', data: { ... } }

  title: attr('string')

});
```
