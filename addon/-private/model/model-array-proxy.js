import ArrayProxy from '@ember/array/proxy';
import { assert } from '@ember/debug';
import createTransform from '../util/create-array-transform-mixin';
import { internal } from './internal';

export const property = fn => () => internal(function(key, internal) {
  return fn(internal).model(true);
});

const TransformMixin = createTransform({
  internal() {
    assert(`this is read-only array`, false);
  },
  public(internal) {
    return internal && internal.model(true);
  }
});

export default ArrayProxy.extend(TransformMixin);
