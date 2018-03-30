import SnapshotObserver from './snapshot-observer';
import { A } from '@ember/array';

// ref: DocumentReference
// delegate: {
//   onLoading() {},
//   onLoaded() {},
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class DocumentArrayObserver extends SnapshotObserver {

  constructor(context, ref, delegate) {
    super(context, ref, delegate, { includeMetadataChanges: true });
    this._content = A();
  }

  _onSnapshot(snapshot) {
    let content = this._content;
    let current = content.get('firstObject');
    if(snapshot.exists) {
      if(current) {
        let model = this._updateModel(current, snapshot);
        if(model !== current) {
          this._destroyModel(current);
          content.removeObject(current);
          content.pushObject(model);
        }
      } else {
        let model = this._createModel(snapshot);
        content.pushObject(model);
      }
    } else {
      if(current) {
        this._destroyModel(current);
        content.removeObject(current);
      }
    }
  }

  _stop() {
    this._content.map(model => this._destroyModel(model));
    this._content = null;
    super._stop();
  }

}
