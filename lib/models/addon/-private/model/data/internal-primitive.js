import InternalData from './internal-data';

export default class InternalPrimitive extends InternalData {

  constructor(context) {
    super(context, undefined);
  }

  model() {
    return this.content;
  }

}
