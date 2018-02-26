import firebase from 'firebase';

const {
  Query,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  GeoPoint
} = firebase.firestore;

export const isQuery = arg => arg instanceof Query;
export const isDocumentReference = arg => arg instanceof DocumentReference;
export const isCollectionReference = arg => arg instanceof CollectionReference;
export const isDocumentSnapshot = arg => arg instanceof DocumentSnapshot;
export const isQuerySnapshot = arg => arg instanceof QuerySnapshot;
export const isGeoPoint = arg => arg instanceof GeoPoint;

export const isQueryOrCollectionReference = arg => isQuery(arg) || isCollectionReference(arg);
