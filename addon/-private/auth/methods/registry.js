import Anonymous from './internal-anonymous';

const mapping = {
  anonymous: Anonymous
};

export const types = Object.keys(mapping);

export const createMethod = (type, ...args) => {
  let Method = mapping[type];
  if(!Method) {
    return;
  }
  return new Method(...args);
}