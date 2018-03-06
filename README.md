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
  match
} from 'ember-zeug/model/computed';
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

  // -> data

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
