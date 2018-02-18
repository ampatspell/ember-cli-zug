export default {
  name: 'thing:dev',
  after: 'thing:store',
  initialize(app) {
    let store = app.lookup('service:store');
    window.createDocument = props => store._internal.documents.createNewDocument(props);
  }
};
