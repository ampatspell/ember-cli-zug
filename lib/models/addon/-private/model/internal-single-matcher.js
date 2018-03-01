import InternalMatcher from './internal-matcher';

export default class InternalSingleMatcher extends InternalMatcher {

  update(model) {
    if(this.content === model) {
      return;
    }
    this.content = model;
    this.opts.didUpdate();
  }

  didAddModel(model) {
    let current = this.content;
    if(!current) {
      if(this.matches(model)) {
        this.update(model);
      }
    }
  }

  didRemoveModel(model) {
    let current = this.content;
    if(current === model) {
      this.update(this.first());
    }
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