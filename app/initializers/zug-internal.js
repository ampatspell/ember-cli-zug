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
    container.register('zug:stores', Stores);
    container.register('zug:context', Context);

    container.register('zug:identity', Identity);
    container.register('zug:query', Query);
    container.register('zug:matcher', Matcher);
    container.register('zug:document', Document);
    container.register('zug:data/object', DataObject);
    container.register('zug:data/array', DataArray);
  }
}
