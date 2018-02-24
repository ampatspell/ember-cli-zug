import Route from '@ember/routing/route';

export default Route.extend({

  model(props) {
    let { path } = props;
    return this.get('store').fork('document').first({ path, optional: true });
  },

  deactivate() {
    this.get('currentModel.context').destroy();
  }

});
