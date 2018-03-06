import SnapshotObserver from './snapshot-observer';
import queryFirst from '../../util/query-first';

// query: CollectionReference or Query
// delegate: {
//   onLoading() {},
//   onLoaded() {},
//   onUpdated() {},
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class QueryFirstObserver extends SnapshotObserver {

  constructor(query, delegate) {
    super(queryFirst(query), delegate, { includeQueryMetadataChanges: true });
  }

  _onSnapshot(snapshot) {
    let change = snapshot.docs[0];
    let current = this._content;
    if(change) {
      if(current) {
        let model = this._updateModel(current, change);
        if(model !== current) {
          this._destroyModel(current);
          this._content = model;
          this._onUpdated();
        }
      } else {
        let model = this._createModel(change);
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
