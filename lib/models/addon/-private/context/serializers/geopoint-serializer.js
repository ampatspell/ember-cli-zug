import FirestoreTypeSerializer from './firestore-type-serializer';

export default class GeopointSerializer extends FirestoreTypeSerializer {

  serialize(value, format) {
    if(format === 'preview') {
      let { latitude, longitude } = value;
      return { type: 'geopoint', latitude, longitude };
    }
    return value;
  }

}
