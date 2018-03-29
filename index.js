'use strict';

let create = require('broccoli-file-creator');
let mergeTrees = require('broccoli-merge-trees');
let firebase = require('firebase');
let pkg = require('./package.json');

module.exports = {
  name: 'ember-cli-zug',
  isDevelopingAddon() {
    return true;
  },
  included() {
    this._super.included.apply(this, arguments);
    this.import(require.resolve('firebase/firebase'));
    this.import(require.resolve('firebase/firebase-firestore'));
    this.import('vendor/ember-cli-zug/firebase-shim.js');
    this.import('vendor/ember-cli-zug/versions.js');
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

    return mergeTrees(trees);
  }
};
