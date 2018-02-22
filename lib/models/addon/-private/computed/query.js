import destroyable from './destroyable';

export default destroyable({
  create(context, result) {
    let { id, query } = result;
    return context._internal.query({ id, query });
  }
});
