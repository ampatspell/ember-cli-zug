import InternalMatcher from './internal-matcher';
import { A } from '@ember/array';

export default class InternalArrayMatcher extends InternalMatcher {

  modelKeyDidChange(model) {
    let content = this.content;
    if(content.includes(model)) {
      if(!this.matches(model)) {
        content.removeObject(model);
      }
    } else {
      if(this.matches(model)) {
        content.pushObject(model);
      }
    }
  }

  didAddModel(model) {
    if(this.matches(model)) {
      this.content.pushObject(model);
    }
  }

  didRemoveModel(model) {
    this.content.removeObject(model);
  }

  all() {
    let matcher = this.matcher;
    return this.identity.filter(matcher);
  }

  start() {
    this.content = A(this.all());
  }

  stop() {
    this.content = null;
  }

}
