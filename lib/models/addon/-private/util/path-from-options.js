import { assert } from '@ember/debug';

export default (opts={}, required, any) => {
  let { path, id, collection } = opts;
  if(path) {
    return path;
  }
  if(collection && id) {
    return `${collection}/${id}`;
  }
  if(any && collection) {
    return collection;
  }
  assert(`options must contain path or id and collection`, !required);
}
