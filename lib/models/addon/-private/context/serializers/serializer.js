export default class Serializer {

  constructor(context) {
    this.context = context;
  }

  get updateReplacesContent() {
    return false;
  }

  get manager() {
    return this.context.dataManager;
  }

}
