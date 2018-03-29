import Stores from 'ember-cli-zug/-private/stores';
import Context from 'ember-cli-zug/-private/context/context';
import Identity from 'ember-cli-zug/-private/model/identity';
import Query from 'ember-cli-zug/-private/model/query';
import Matcher from 'ember-cli-zug/-private/model/matcher';
import Document from 'ember-cli-zug/-private/model/document';
import DataObject from 'ember-cli-zug/-private/model/data/object';
import DataArray from 'ember-cli-zug/-private/model/data/array';

export default {
  name: 'zug:internal',
  initialize(container) {
    container.register('models:stores', Stores);
    container.register('models:context', Context);

    container.register('models:identity', Identity);
    container.register('models:query', Query);
    container.register('models:matcher', Matcher);
    container.register('models:document', Document);
    container.register('models:data/object', DataObject);
    container.register('models:data/array', DataArray);
  }
}
