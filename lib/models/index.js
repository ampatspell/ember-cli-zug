/* eslint-env node */
'use strict';

let create = require('broccoli-file-creator');
let firebase = require('firebase');
let pkg = require('../../package.json');

module.exports = {
  name: 'models',
  included() {
    this._super.included.apply(this, arguments);
    this.app.import('vendor/ember-cli-models/versions.js');
  },
  treeForVendor() {
    return create('ember-cli-models/versions.js', [
      `Ember.libraries.register('ember-zug', '${pkg.version}');`,
      `Ember.libraries.register('Firebase SDK', '${firebase.SDK_VERSION}');`
    ].join('\n'));
  },
  isDevelopingAddon() {
    return true;
  }
};
