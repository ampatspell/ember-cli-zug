import EmberObject from '@ember/object';
import { readOnly, alias } from '@ember/object/computed';

export const path = () => readOnly('doc.path');
export const attr = key => alias(`doc.data.${key}`);

export default EmberObject.extend({
});
