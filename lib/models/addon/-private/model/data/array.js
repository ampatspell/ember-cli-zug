import ArrayProxy from '@ember/array/proxy';
import createTransform from '../../util/create-array-transform-mixin';
import { InternalMixin } from '../internal';

const TransformMixin = createTransform({
  internal(model) {
    return this._internal.toInternal(model);
  },
  public(internal) {
    return this._internal.toModel(internal);
  }
});

export default ArrayProxy.extend(InternalMixin, TransformMixin);
