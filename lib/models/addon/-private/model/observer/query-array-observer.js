import SnapshotObserver from './snapshot-observer';
import { A } from '@ember/array';

// query: CollectionReference or Query
// delegate: {
//   onLoading() {},
//   onLoaded() {},
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class QueryArrayObserver extends SnapshotObserver {

  constructor(query, delegate) {
    super(query, delegate, { includeQueryMetadataChanges: true });
    this._content = A();
  }

  _onChange(change) {
    let { type, oldIndex, newIndex, doc } = change;
    let content = this._content;
    if(type === 'added') {
      let model = this._createModel(doc);
      content.insertAt(newIndex, model);
    } else if(type === 'modified') {
      let current = content.objectAt(oldIndex);
      let model = this._updateModel(current, doc);
      if(oldIndex !== newIndex) {
        content.removeAt(oldIndex);
        content.insertAt(newIndex, model);
      } else if (current !== model) {
        content.replace(newIndex, 1, [ model ]);
      }
    } else if(type === 'removed') {
      let model = content.objectAt(oldIndex);
      this._destroyModel(model);
      content.removeAt(oldIndex);
    }
  }

  _onSnapshot(snapshot) {
    let changes = snapshot.docChanges;
    changes.map(change => this._onChange(change));
  }

  _stop() {
    this._content.map(model => this._destroyModel(model));
    this._content = null;
    super._stop();
  }

}
