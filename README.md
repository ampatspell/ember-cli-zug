# thing

Nothing here yet. Experimental.

## Notes

``` javascript
let store = getOwner(this).lookup('service:store');

let person = store.model('person', { collection: 'people' });
await person.save();

let query = store.query(db => db.collection('people').limit(1));
await query.fetch();

query.get('models');

query.destroy();

//

let nested = store.fork('something');
let query = nested.query(db => db.collection('people').limit(1));
await query.fetch();
let person = query.get('model');
person.set('name', 'ampatspell');
await person.save();

nested.destroy(); // destroys query
```

* store is context
* store.fork() creates nested context
* context can be extended models/contexts/<name>
* context destroys queries and models
* context has models identity
* model has document
* document has data
* document has multiple internal impls (DocumentReference, Local, ...) which is switched on save
