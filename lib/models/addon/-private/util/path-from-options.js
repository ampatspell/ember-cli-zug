import { assert } from '@ember/debug';

export default (opts={}, required) => {
  let { path, id, collection } = opts;
  if(path) {
    return path;
  }
  if(collection && id) {
    return `${collection}/${id}`;
  }
  assert(`options must contain path or id and collection`, !required);
}
