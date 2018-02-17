export const call = (target, method, ...args) => {
  if(target) {
    return method.call(target, ...args);
  }
  return method(...args);
};

export const maybe = (target, method, ...args) => {
  if(!method) {
    return;
  }
  return call(target, method, ...args);
};
