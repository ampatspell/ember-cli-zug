# Model computed

* Create transient model
* Create wrapper model for persistent model
* Create array of wrapper models

Model is destroyed when owner is destroyed.

``` javascript
export default Component.extend({

  model: transient({
    context: 'context',
    type: 'single',
    owner: [ 'duck' ], // any
    create(owner) {
      let duck = owner.get('duck');
      return { name: 'duck/edit', data: { duck } };
    }
  }),

  models: transient({
    context: 'context',
    type: 'array',
    owner: 'ducks', // must be array
    create(duck, owner) {
      return { name: 'duck/edit', data: { duck }};
    }
  })

});
```
