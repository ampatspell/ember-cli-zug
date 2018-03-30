# ember-cli-zug [![Build Status](https://travis-ci.org/ampatspell/ember-cli-zug.svg?branch=master)](https://travis-ci.org/ampatspell/ember-cli-zug)

[Google Cloud Firestore](https://firebase.google.com/products/firestore/) persistence library for [Ember.js](https://emberjs.com/).

> Warning: This addon is currently under development. Not ready for production yet.

> Documentation coming soon.

## Install

Create a new ember app

```
$ ember new foof
$ cd foof
```

Remove `ember-data` and `ember-ajax` from package.json

``` diff
{
  "name": "foof",
  "version": "0.0.0",
  ...
  "devDependencies": {
    ...
    "ember-cli": "~3.0.0",
-    "ember-ajax": "^3.0.0",
-    "ember-data": "~3.0.0",
    "ember-export-application-global": "^2.0.0",
    "ember-load-initializers": "^1.0.0",
    ...
  },
  ...
}
```

Install addon

```
$ ember install ember-cli-zug

npm: Installed ember-cli-zug
installing ember-cli-zug
  create /app/instance-initializers/foof-injections.js
  create /app/instance-initializers/foof-store.js
  create /app/models/message.js
  create /app/models/state.js
  create /app/routes/application.js
Installed addon package.
```

Open (Firebase Console)[https://console.firebase.google.com], select existing or create a new project.

Make sure Cloud Firestore is enabled in Database section.

Open Project Overview and click on "Add Firebase to your web app".

Copy the contents of `config` and paste it in `app/instance-initializers/foof-store.js` `firebase` like this:

``` javascript
let firebase = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "..."
};
...
```

Start the app, check out the console.

```
$ ember s
```

## Exports

``` javascript
import registerContextService from 'ember-cli-zug/register-context/service';

import Context from 'ember-cli-zug/context';

import PersistedModel from 'ember-cli-zug/model/persisted';
import TransientModel from 'ember-cli-zug/model/transient';

import {
  id,
  collection,
  path,
  promise,
  attr
} from 'ember-cli-zug/model/persisted/computed';

import {
  query,
  match,
  transient,
  nest
} from 'ember-cli-zug/model/computed';
```

## Context

``` javascript
export default Context.extend({

  identifier,
  absoluteIdentifier,

  ready,

  identity,

  nest,
  model,
  existing,
  query,
  matcher,
  load,
  first,

  settle,
  hasModelClassForName,

});
```

## Model

### Persisted model

``` javascript
export default PersistedModel.extend({

  context,

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

### Transient

Creates a transient model which is destroyed when owner (component in this case) is destroyed and recreated when dependencies (`owner`) change.

``` javascript
export default Component.extend({

  context: null,

  name: 'hey',

  thing: transient(function() {
    let name = this.get('name');
    return {
      owner: [ 'name' ],
      props: { name: 'thing', data: { name } }
    };
  })

});
```

### Nest

Create a nested context which is destroyed when owner is.

``` javascript
export default Component.extend({

  context: null,

  name: 'hey',

  nested: nest(function() {
    let name = this.get('name');
    return {
      context: 'context',
      owner: [ 'name' ],
      name
    };
  })

});
```
