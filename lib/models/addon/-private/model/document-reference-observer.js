import BaseSnapshotObserver from './base-snapshot-observer';

export default class DocumentObserver extends BaseSnapshotObserver {

  constructor(ref, delegate) {
    super(ref, delegate, { includeMetadataChanges: true });
  }

  get _type() {
    return 'document-observer';
  }

  _onSnapshot(snapshot) {
    let exists = snapshot.exists;
    let data = snapshot.data();
    let metadata = snapshot.metadata;
    let props = {
      exists,
      metadata,
      data
    };
    return this._delegate.update(props);
  }

}