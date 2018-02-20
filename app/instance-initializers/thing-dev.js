export default {
  name: 'thing:dev',
  after: 'thing:store',
  initialize(app) {
    let store = app.lookup('service:store');
    window.stores = app.lookup('models:stores');
    window.createDocument = props => store._internal.documents.createNewDocument(props);
  }
};
