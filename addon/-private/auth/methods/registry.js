import anonymous from './internal-anonymous';
import email from './internal-email';

const mapping = {
  anonymous,
  email
};

export const types = Object.keys(mapping);

export const createMethod = (type, ...args) => {
  let Method = mapping[type];
  if(!Method) {
    return;
  }
  return new Method(type, ...args);
}
