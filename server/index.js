/* eslint-env node */
'use strict';

module.exports = app => {

  let dev = {
    apiKey: "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
    databaseURL: "https://ohne-zeit.firebaseio.com",
    storageBucket: "ohne-zeit.appspot.com",
    authDomain: "ohne-zeit.firebaseapp.com",
    messagingSenderId: "491555737764",
    projectId: "ohne-zeit"
  };

  let ci = {
    apiKey: "AIzaSyAOqRA96vnTlCnvGvb7PtwyARfvxSx7gDA",
    authDomain: "ohne-zeit-test.firebaseapp.com",
    databaseURL: "https://ohne-zeit-test.firebaseio.com",
    projectId: "ohne-zeit-test",
    storageBucket: "ohne-zeit-test.appspot.com",
    messagingSenderId: "1043845604698"
  };

  let config = process.env.CI ? ci : dev;

  console.log('Travis:', !!process.env.CI);
  console.log(config);

  app.get('/__/firebase/init.json', (req, res) => res.json(config));

};
