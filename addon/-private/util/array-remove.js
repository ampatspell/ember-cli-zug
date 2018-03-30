export default (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};
