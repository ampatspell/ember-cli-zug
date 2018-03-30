import { helper } from '@ember/component/helper';

export function eq(params) {
  let [ value, expected ] = params;
  return value === expected;
}

export default helper(eq);
