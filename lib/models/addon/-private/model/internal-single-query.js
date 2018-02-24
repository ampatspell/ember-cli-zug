import InternalQuery from './internal-query';

export default class InternalSingleQuery extends InternalQuery {

  constructor(context, opts) {
    super(context, opts);
    throw new Error('not here yet');
  }

  get type() {
    return 'single';
  }

}
