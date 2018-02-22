import { alias } from '@ember/object/computed';

const documentAlias = key => alias(`doc.${key}`);

export const id = () => documentAlias('id');
export const collection = () => documentAlias('collection');
export const path = () => documentAlias('path');

export const attr = name => alias(`doc.data.${name}`);

export const promise = name => function() {
  let doc = this.get('doc');
  return doc[name].call(doc, ...arguments).then(() => this);
};
