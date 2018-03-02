# TODO

* tests for query computed
* destroy transient model
* computed model
* transforms for attr
* model fragment
* data update instead of replace
* firebase session
* firebase storage
* data.serialized types -- store, shoebox, preview
* fastboot shoebox for models, documents, query states

``` javascript
// models/person.js
export default PersistedModel.extend({

  id: id(),
  name: attr(),
  address: object({ name: 'person/address' }),
  addresses: array({ name: 'person/address' }),

});

// models/person/address.js
export default PerssitedObject.extend({

  street:  attr(),
  city:    attr(),
  country: attr(),
  zip:     attr()

});

let person = store.model({ name: 'person', data: { name: 'zeeba' } });

let address = store.object({ name: 'person/address', data: { street: 'zeeba str' } }); // initial data applied on set
person.set('address', address);
person.set('address.street', 'zeeba str'); // sets model.doc.data.address.street

let address = store.object({ name: 'person/address', data: { street: 'zeeba str' } }); // initial data applied on set
person.get('addresses').pushObject(address);
person.get('addresses.firstObject').set('street', 'zeeba str');
```
