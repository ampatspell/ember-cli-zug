import Firebase from 'models/-private/firebase';
import Store from 'models/-private/store';
import Context from 'models/-private/context';
import Contexts from 'models/-private/contexts';
import Queries from 'models/-private/queries';
import Query from 'models/-private/query';
import Documents from 'models/-private/documents';
import Document from 'models/-private/document';

export default {
  name: 'models:internal',
  initialize(container) {
    container.register('service:firebase', Firebase);
    container.register('service:store', Store);

    container.register('models:context', Context);
    container.register('models:contexts', Contexts);
    container.register('models:queries', Queries);
    container.register('models:query', Query);
    container.register('models:documents', Documents);
    container.register('models:document', Document);
  }
}
