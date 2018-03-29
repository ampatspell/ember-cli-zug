(function() {

  function vendorModule() {
    'use strict';

    var firebase;

    if(window.FastBoot) {
      firebase = FastBoot.require('firebase');
      FastBoot.require('firebase/firestore');
    } else {
      firebase = self['firebase'];
    }

    return {
      'default': firebase,
      __esModule: true
    };
  }

  define('firebase', [], vendorModule);
})();
