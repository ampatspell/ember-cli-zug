import { assign } from '@ember/polyfills';

export default args => {
  let props = args[0];
  if(args.length === 2) {
    let app = args[0];
    props = args[1];
    props = assign({ app }, props);
  }
  return props;
};
