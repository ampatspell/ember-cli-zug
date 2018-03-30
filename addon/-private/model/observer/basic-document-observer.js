import SnapshotObserver from './snapshot-observer';

export default class BasicDocumentObserver extends SnapshotObserver {

  constructor(context, ref, delegate) {
    super(context, ref, delegate, { includeMetadataChanges: true });
  }

  _onSnapshot(snapshot) {
    let exists = snapshot.exists;
    let data = snapshot.data({ serverTimestamps: 'estimate' });
    let metadata = snapshot.metadata;
    let props = {
      exists,
      metadata,
      data
    };
    return this._delegate.update(props);
  }

}
