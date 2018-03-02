export default class Serializer {

  constructor(context) {
    this.context = context;
  }

  get manager() {
    return this.context.dataManager;
  }

}
