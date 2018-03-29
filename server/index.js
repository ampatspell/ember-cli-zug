/* eslint-env node */
'use strict';

module.exports = app => {

  const path = require('path');
  const serve = require('serve-static');

  let config = {
    apiKey: "AIzaSyApr48AJWch97DybXXVhF53LJttudP8E2Y",
    authDomain: "ember-cli-zug.firebaseapp.com",
    databaseURL: "https://ember-cli-zug.firebaseio.com",
    projectId: "ember-cli-zug",
    storageBucket: "ember-cli-zug.appspot.com",
    messagingSenderId: "102388675337"
  };

  app.use('/coverage', serve(path.join(__dirname, '../coverage'), { 'index': [ 'index.html' ] }));
  app.get('/__/firebase/init.json', (req, res) => res.json(config));

};
