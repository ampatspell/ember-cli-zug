'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'thing',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
      },
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },
    APP: {
    },
    firebase: {
      apiKey: "AIzaSyDyjC_rsH7_BYJwjKgIrHhoSvRBfNnjGrQ",
      authDomain: "ohne-zeit.firebaseapp.com",
      databaseURL: "https://ohne-zeit.firebaseio.com",
      projectId: "ohne-zeit",
      storageBucket: "",
      messagingSenderId: "491555737764"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
  }

  return ENV;
};
