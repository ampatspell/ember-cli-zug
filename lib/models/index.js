/* eslint-env node */
'use strict';

let create = require('broccoli-file-creator');
let firebase = require('firebase');

module.exports = {
  name: 'models',
  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/ember-cli-models/versions.js');
  },
  treeForVendor() {
    let content = [
      `Ember.libraries.register('ember-cli-models', '0.0.0');`,
      `Ember.libraries.register('Firebase SDK', '${firebase.SDK_VERSION}');`,
    ].join('\n');
    return create('ember-cli-models/versions.js', content);
  },
  isDevelopingAddon() {
    return true;
  }
};
