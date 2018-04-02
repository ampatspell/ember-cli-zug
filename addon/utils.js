import firebase from 'firebase';
import { isFieldValue, isGeoPoint } from './-private/util/firestore-types';
import makeID from './-private/util/random-string';

export const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export {
  isFieldValue,
  isGeoPoint,
  makeID
};
