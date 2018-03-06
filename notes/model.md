# Model computed

* Create transient model
* Create wrapper model for persistent model
* Create array of wrapper models

Model is destroyed when owner is destroyed.

``` javascript
export default Component.extend({

  model: model({

  })

});
```
