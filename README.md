# thing

[![Build Status](https://travis-ci.org/ampatspell/thing.svg?branch=master)](https://travis-ci.org/ampatspell/thing)

Nothing here yet. Experimental.

Soon `lib/models` in-repo-addon will be `ember-zeug` (whatever the name will be).

## Exports

``` javascript
import registerContextService from 'ember-zeug/register-context/service';

import Context from 'ember-zeug/context';

import PersistedModel from 'ember-zeug/model/persisted';
import TransientModel from 'ember-zeug/model/transient';

import {
  id,
  collection,
  path,
  promise,
  attr
} from 'ember-zeug/model/persisted/computed';

import {
  query,
  match,
  transient,
  fork
} from 'ember-zeug/model/computed';
```

## Model

### Persisted model

``` javascript
export default PersistedModel.extend({

  context,
  path,

  modelName,
  modelType, // persisted

  isPersistedModel, // true
  isTransientModel, // false

  doc: {
    context,
    id,
    collection,
    path,

    isNew,
    isDirty,
    isLoaded,
    isLoading,
    isSaving,
    isExisting,
    isError,
    error,

    data: {
      // firestore document as observable ember objects
    },

    serialized, // property which includes path, state, data

    load,
    save,
    delete,
  }

});
```

### Transient model

``` javascript
export default TransientModel.extend({

  context,
  path, // optional

  modelName,
  modelType, // transient

  isPersistedModel, // false
  isTransientModel, // true

});
```

## Computed properties

### Document

``` javascript
export default PersistedModel.extend({

  // -> doc

  id: id(),
  collection: collection(),
  path: path(),

  save: promise('save')

});
```

### Data

``` javascript
export default PersistedModel.extend({

  // -> doc.data

  name: attr({ type: 'string', key: 'name' }),

  customKey: 'email',
  custom: attr(function() {
    return {
      owner: [ 'customKey' ],
      key: this.get('customKey')
    };
  })

});
```

### Query

``` javascript
const State = TransientModel.extend({

  // -> any

  ducks: query({
    type: 'array',
    query: db => db.collection('ducks').orderBy('name')
  }),

  duck: query({
    type: 'single',
    query: db => db.collection('ducks').orderBy('name')
  }),

  order: 'name',
  dependent: query(function() {
    let order = this.get('order');
    return {
      id: `by-${order}`,
      type: 'array',
      owner: [ 'order' ],
      query: db => db.collection('ducks').orderBy(order)
    }
  })

});
```

### Match

``` javascript
const Duck = PersistedModel.extend({

  // -> any

  friend: match({
    type: 'single',
    owner: [ 'doc.id' ],
    model: [ 'doc.data.friendId' ],
    matches(model, owner) {
      return model.get('doc.data.friendId') === owner.get('id');
    }
  }),

  friends: match({
    type: 'array',
    owner: [ 'doc.id' ],
    model: [ 'doc.data.friendId' ],
    matches(model, owner) {
      return model.get('doc.data.friendId') === owner.get('id');
    }
  })

});
```

### Transient

Creates a transient model which is destroyed when owner (component in this case) is destroyed and recreated when dependencies (`owner`) change.

``` javascript
export default Component.extend({

  context: null,

  name: 'hey',

  thing: transient({
    owner: [ 'name' ],
    create(owner) {
      let name = owner.get('name');
      return { name: 'thing', data: { name } };
    }
  })

});
```

### Fork

Forks a nested context which is destroyed when owner is.

``` javascript
export default Component.extend({

  context: null,

  name: 'hey',

  forked: fork(function() {
    let name = this.get('name');
    return {
      context: 'context',
      owner: [ 'name' ],
      name
    };
  })

});
```
