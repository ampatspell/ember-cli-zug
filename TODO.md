# TODO

* refactor query to support one and array of results
* computed model
* computed attr
* computed identity lookup (relationship base)
* model fragment
* data update instead of replace
* data.serialized types -- store, preview
* fastboot shoebox for models and documents
* firebase session
* firebase storage

``` javascript
export default Model.extend({

  // type: `single` or `array` denotes `query.content` type model vs array

  all: query({
    id: 'people-by-name',
    type: 'array',
    query: db => db.collection('people').orderBy('name', 'asc') // array
  }),

  all: query({
    id: 'people-by-name',
    type: 'array',
    query: db => db.collection('people/ampatspell') // doc
  }),

  first: query({
    id: 'first-blog-post',
    type: 'single',
    query: db => db.collection('people/ampatspell/posts').orderBy('createdAt', 'desc') // array
  }),

  single: query({
    id: 'person-ampatspell',
    type: 'single',
    query: db => db.collection('people').where('name', '==', 'ampatspell') // array
  }),

  single: query({
    id: 'person-ampatspell',
    type: 'single',
    query: db => db.collection('people').doc('ampatspell') // doc
  }),

});

```
