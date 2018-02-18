import BaseSnapshotObserver from './base-snapshot-observer';
import { A } from '@ember/array';

// query: CollectionReference or Query
// delegate: {
//   createModel(doc) {},
//   updateModel(model, doc) {},
//   destroyModel(model) {}
// }
export default class QueryObserver extends BaseSnapshotObserver {

  constructor(query, delegate) {
    super(query, delegate, { includeQueryMetadataChanges: true });
    this._content = A();
    this._start();
  }

  get _type() {
    return 'query-observer';
  }

  get content() {
    return this._content;
  }

  _createModel(doc) {
    return this._delegate.createModel(doc);
  }

  _updateModel(model, doc) {
    return this._delegate.updateModel(model, doc);
  }

  _destroyModel(model) {
    return this._delegate.destroyModel(model);
  }

  // TODO: store Document here
  // document should have at least ref and data
  _onChange(change) {
    let { type, oldIndex, newIndex, doc } = change;
    let ref = doc.ref;
    console.log('_onChange', type, ref.id, oldIndex, newIndex, this);
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
