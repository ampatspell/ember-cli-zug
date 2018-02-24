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
