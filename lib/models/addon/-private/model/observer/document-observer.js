import SnapshotObserver from './snapshot-observer';

// query: DocumentReference
// delegate: {
//   onLoading() {},
//   onLoaded() {},
//   onUpdated() {},
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class DocumentObserver extends SnapshotObserver {

  constructor(ref, delegate) {
    super(ref, delegate, { includeMetadataChanges: true });
  }

  _onSnapshot(snapshot) {
    let current = this._content;
    if(snapshot.exists) {
      if(current) {
        let model = this._updateModel(current, snapshot);
        if(model !== current) {
          this._destroyModel(current);
          this._content = model;
          this._onUpdated();
        }
      } else {
        let model = this._createModel(snapshot);
        this._content = model;
        this._onUpdated();
      }
    } else {
      if(current) {
        this._destroyModel(current);
        this._content = null;
        this._onUpdated();
      }
    }
  }

  _stop() {
    this._content && this._destroyModel(this._content);
    this._content = null;
    super._stop();
  }

}
