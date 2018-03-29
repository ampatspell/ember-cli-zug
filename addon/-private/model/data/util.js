import InternalData from './internal-data';

export const nothing = { __nothing__: '__nothing__' };

export const isInternal = value => value instanceof InternalData;

export const toModel = value => {
  if(isInternal(value)) {
    return value.model(true);
  }
  return value;
}

export const toInternal = value => {
  let internal = value && value._internal;
  if(isInternal(internal)) {
    return internal;
  }
  return value;
}

export const isInternalObject = value => isInternal(value) && value.type === 'internal-object';
export const isInternalArray = value => isInternal(value) && value.type === 'internal-array';
