import {
  test as test_,
  only as only_,
  todo as todo_,
  skip
} from 'ember-qunit';

const wrap = q => function(name, fn) {
  return q(name, async function(assert) {
    try {
      return await fn.call(this, assert);
    } catch(e) {
      console.error(e && e.stack || e);
      throw e;
    }
  });
};

export const test = wrap(test_);
export const only = wrap(only_);
export const todo = wrap(todo_);

test.skip = skip;
test.only = only;
test.todo = todo;
