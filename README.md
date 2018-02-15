# thing

Experiment: don't have an identity. base this all on queries and models which encapsulate multiple queries, reference relationships in parent model.

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
