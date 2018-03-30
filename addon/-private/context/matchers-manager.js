import { A } from '@ember/array';
import { assert } from '@ember/debug';
import Destroyable from '../model/destroyable';
import InternalSingleMatcher from '../model/internal-single-matcher';
import InternalArrayMatcher from '../model/internal-array-matcher';

export default class MatchersManager extends Destroyable {

  constructor(context) {
    super();
    this.context = context;
    this.matchers = A();
  }

  _internalMatchersFactoryForOptions(opts={}) {
    let { type } = opts;
    if(type === 'single') {
      return InternalSingleMatcher;
    } else if(type === 'array') {
      return InternalArrayMatcher;
    }
    assert(`matcher opts.type must be 'single' or 'array'`, false);
  }

  // { type: 'single/array', model: [ 'doc.id' ], matches(model) {} }
  createInternalMatcher(opts) {
    let factory = this._internalMatchersFactoryForOptions(opts);
    let internal = new factory(this.context, opts);
    this.matchers.pushObject(internal);
    return internal;
  }

  removeInternalMatcher(matcher) {
    this.matchers.removeObject(matcher);
  }

  willDestroy() {
    this.matchers.map(matcher => matcher.destroy());
    super.willDestroy();
  }

}
