import FirestoreTypeSerializer from './firestore-type-serializer';

export default class FieldValueSerializer extends FirestoreTypeSerializer {

  serialize(value, format) {
    if(format === 'preview') {
      return { type: 'field-value' };
    }
    return value;
  }

}
