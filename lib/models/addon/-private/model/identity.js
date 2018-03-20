import ArrayProxy from '@ember/array/proxy';
import { assert } from '@ember/debug';
import createTransform from '../util/create-array-transform-mixin';

const TransformMixin = createTransform({
  internal() {
    assert(`do not mutate identity directly`, false);
  },
  public(internal) {
    return internal && internal.model(true);
  }
});

export default ArrayProxy.extend(TransformMixin);


/*

  import MutableArray from '@ember/array/mutable';

  export default EmberObject.extend(MutableArray, {

    objectAt(index) {
      return this._internal.content.objectAt(index).model(true);
    },

    replace(idx, amt, objects) {
      if(amt > 0) {
        let internal = this._internal.content.slice(idx, idx + amt);
        this._internal.removeObjects(internal);
      }
      if(objects) {
        this._internal.addObjects(objects.map(obj => obj._internal), idx);
      }
    }

    & notify internal.content changes

  });

*/