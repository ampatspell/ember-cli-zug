import { alias } from '@ember/object/computed';

export const id = () => alias('doc.id');

export const attr = name => alias(`doc.data.${name}`);

export const promise = name => function() {
  let doc = this.get('doc');
  return doc[name].call(doc, ...arguments).then(() => this);
};
