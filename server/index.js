/* eslint-env node */
'use strict';

module.exports = app => {

  const path = require('path');
  const serve = require('serve-static');

  let config = {
    apiKey: "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
    databaseURL: "https://ohne-zeit.firebaseio.com",
    storageBucket: "ohne-zeit.appspot.com",
    authDomain: "ohne-zeit.firebaseapp.com",
    messagingSenderId: "491555737764",
    projectId: "ohne-zeit"
  };

  app.use('/coverage', serve(path.join(__dirname, '../coverage'), { 'index': [ 'index.html' ] }));
  app.get('/__/firebase/init.json', (req, res) => res.json(config));

};
