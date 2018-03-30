import firebase from 'firebase';
import { isFieldValue, isGeoPoint } from './-private/util/firestore-types';

export const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export {
  isFieldValue,
  isGeoPoint
};
