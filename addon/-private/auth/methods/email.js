import Method, { modelpromise } from './method';

export default Method.extend({

  signIn: modelpromise('signIn'),
  signUp: modelpromise('signUp')

});
