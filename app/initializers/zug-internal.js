import Stores from 'ember-cli-zug/-private/stores';
import Context from 'ember-cli-zug/-private/context/context';
import Identity from 'ember-cli-zug/-private/model/identity';
import Query from 'ember-cli-zug/-private/model/query';
import Matcher from 'ember-cli-zug/-private/model/matcher';
import Document from 'ember-cli-zug/-private/model/document';
import DataObject from 'ember-cli-zug/-private/model/data/object';
import DataArray from 'ember-cli-zug/-private/model/data/array';
import Auth from 'ember-cli-zug/-private/auth/auth';
import AuthUser from 'ember-cli-zug/-private/auth/user';
import AuthMethods from 'ember-cli-zug/-private/auth/methods';
import AuthMethodAnonymous from 'ember-cli-zug/-private/auth/methods/anonymous';
import AuthMethodEmail from 'ember-cli-zug/-private/auth/methods/email';
import Storage from 'ember-cli-zug/-private/storage/storage';
import StorageReference from 'ember-cli-zug/-private/storage/reference';

export default {
  name: 'zug:internal',
  initialize(container) {
    container.register('zug:stores', Stores);
    container.register('zug:context', Context);

    container.register('zug:auth', Auth);
    container.register('zug:auth/user', AuthUser);
    container.register('zug:auth/methods', AuthMethods);
    container.register('zug:auth/methods/anonymous', AuthMethodAnonymous);
    container.register('zug:auth/methods/email', AuthMethodEmail);

    container.register('zug:storage', Storage);
    container.register('zug:storage/reference', StorageReference);

    container.register('zug:identity', Identity);
    container.register('zug:query', Query);
    container.register('zug:matcher', Matcher);
    container.register('zug:document', Document);
    container.register('zug:data/object', DataObject);
    container.register('zug:data/array', DataArray);
  }
}
