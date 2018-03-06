import FirestoreTypeSerializer from './firestore-type-serializer';

export default class DocumentReferenceSerializer extends FirestoreTypeSerializer {

  serialize(value, format) {
    if(format === 'preview') {
      let { path } = value;
      return { type: 'document-reference', path };
    }
    return value;
  }

}
