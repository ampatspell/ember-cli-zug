import { alias as alias_ } from '@ember/object/computed';

const alias = key => alias_(`doc.${key}`);

export const id = () => alias('id');
export const collection = () => alias('collection');
export const path = () => alias('path');

export const promise = name => function() {
  let doc = this.get('doc');
  let fn = doc[name];
  return fn.call(doc, ...arguments).then(() => this);
};
