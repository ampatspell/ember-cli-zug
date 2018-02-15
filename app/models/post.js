import Model, { path, attr } from './firestore/model';

export default Model.extend({

  path: path(),
  message: attr('message')

});
