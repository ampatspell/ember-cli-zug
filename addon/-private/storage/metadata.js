import EmberObject, { computed } from '@ember/object';
import { InternalMixin, prop, modelprop, state, serialized, promise } from '../model/internal';

// TODO: keys comes from metadata-state
let stateKeys = [
  'isExisting',
  'isLoaded',
  'isError',
  'error'
];

const raw = () => computed('raw', function(key) {
  let raw = this.get('raw');
  if(!raw) {
    return;
  }
  return raw[key];
}).readOnly();

const rawDate = key => computed('raw', function() {
  let value = this.get(`raw.${key}`);
  if(!value) {
    return;
  }
  return new Date(value);
}).readOnly();

export default EmberObject.extend(InternalMixin, {

  reference:  modelprop(),

  isExisting: state(),
  isLoaded: state(),
  isError: state(),
  error: state(),

  raw: prop(),

  type: raw(),

  name: raw(),
  size: raw(),
  contentType: raw(),
  customMetadata: raw(),
  downloadURLs: raw(),

  cacheControl: raw(),
  contentDisposition: raw(),
  contentEncoding: raw(),
  contentLanguage: raw(),

  bucket: raw(),
  fullPath: raw(),

  generation: raw(),
  md5Hash: raw(),
  metageneration: raw(),

  createdAt: rawDate('timeCreated'),
  updatedAt: rawDate('updated'),

  load: promise('load'),

  serialized: serialized([ ...stateKeys, 'name', 'size', 'contentType' ])

});
