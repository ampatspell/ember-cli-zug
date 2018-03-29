import { isQueryOrCollectionReference } from './firestore-types';

export default q => {
  if(isQueryOrCollectionReference(q)) {
    return q.limit(1);
  }
  return q;
};
