import InternalMatcher from './internal-matcher';

export default class InternalSingleMatcher extends InternalMatcher {

  constructor(context, opts) {
    super(context, opts);
  }

  update(model) {
    this.content = model;
    this.opts.didUpdate();
  }

  modelKeyDidChange(model) {
    let current = this.content;
    if(current) {
      if(model === current) {
        if(!this.matches(model)) {
          this.update(this.first());
        }
      }
    } else {
      if(this.matches(model)) {
        this.update(model);
      }
    }
  }

  first() {
    let matcher = this.matcher;
    return this.identity.find(matcher) || null;
  }

  start() {
    this.content = this.first();
  }

  stop() {
    this.content = null;
  }

}
