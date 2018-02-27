# TODO

* computed model
* transforms for attr
* computed identity lookup (relationship base)
* model fragment
* data update instead of replace
* data.serialized types -- store, preview
* fastboot shoebox for models and documents
* firebase session
* firebase storage

``` javascript
import PersistedModel from 'models/model/persisted';
import { id, attr, promise } from 'models/model/persisted/computed';
import { match } from 'models/model/computed';

export default PersistedModel.extend({

  id: id(),

  name:    attr(),
  email:   attr(),

  blogs: match({
    type: 'single',
    context: 'context',
    owner: [ 'doc.id' ],
    model: [ 'modelName', 'doc.data.authorId' ],
    matches(model, owner) {
      if(model.get('modelName') !== 'blog') {
        return;
      }
      return owner.get('doc.id') === model.get('doc.data.authorId');
    }
  }),

  save: promise('save')

});
```
