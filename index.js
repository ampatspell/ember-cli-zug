'use strict';

let create = require('broccoli-file-creator');
let mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
let firebase = require('firebase');
let pkg = require('./package.json');
let path = require('path');

module.exports = {
  name: 'ember-cli-zug',
  isDevelopingAddon() {
    return false;
  },
  included(app) {
    this._super.apply(this, arguments);
    app.import('vendor/ember-cli-zug/firebase.js');
    app.import('vendor/ember-cli-zug/firebase-firestore.js');
    app.import('vendor/ember-cli-zug/firebase-shim.js');
    app.import('vendor/ember-cli-zug/versions.js');
  },
  treeForVendor(vendorTree) {
    let trees = [];

    if(vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(create('ember-cli-zug/versions.js', [
      `Ember.libraries.register('ember-cli-zug', '${pkg.version}');`,
      `Ember.libraries.register('Firebase SDK', '${firebase.SDK_VERSION}');`
    ].join('\n')));

    trees.push(new Funnel(path.dirname(require.resolve('firebase/firebase')), {
      files: [
        'firebase.js',
        'firebase-firestore.js'
      ],
      destDir: '/ember-cli-zug'
    }));

    return mergeTrees(trees);
  }
};
