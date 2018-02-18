import Route from '@ember/routing/route';

export default Route.extend({

  model(props) {
    let { path } = props;
    let documents = this.get('store').fork('document')._internal.documents;
    // let doc = documents.createExistingDocument({ path });
    // return doc.load().catch(err => doc);
    return documents.loadExistingDocument({ path });
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
