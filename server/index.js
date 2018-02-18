/* eslint-env node */
'use strict';

module.exports = app => {

  let config = {
    apiKey: "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
    databaseURL: "https://ohne-zeit.firebaseio.com",
    storageBucket: "ohne-zeit.appspot.com",
    authDomain: "ohne-zeit.firebaseapp.com",
    messagingSenderId: "491555737764",
    projectId: "ohne-zeit"
  };

  app.get('/__/firebase/init.json', (req, res) => res.json(config));

};
