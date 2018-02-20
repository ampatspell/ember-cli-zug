import Route from '@ember/routing/route';

export default Route.extend({

  model(props) {
    let { path } = props;
    let documents = this.get('store').fork('document')._internal.documentsManager;
    let doc = documents.existingInternalDocument({ path, create: true }).model(true);
    return doc.load({ optional: true });
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
