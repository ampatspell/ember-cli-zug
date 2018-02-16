import InternalData from './internal-data';
import InternalObject from './internal-object';

export const toModel = value => {
  if(value instanceof InternalData) {
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

export const isInternal = value => value instanceof InternalData;
export const isInternalObject = value => value instanceof InternalObject;
