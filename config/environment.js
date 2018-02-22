'use strict';

let { name, version } = require('../package.json')

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
    thing: {
      name,
      version
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

  // if (environment === 'production') {
  // }

  if(process.env.CI) {
    ENV.test = {
      firebase: {
        config: {
          apiKey: "AIzaSyAOqRA96vnTlCnvGvb7PtwyARfvxSx7gDA",
          authDomain: "ohne-zeit-test.firebaseapp.com",
          databaseURL: "https://ohne-zeit-test.firebaseio.com",
          projectId: "ohne-zeit-test",
          storageBucket: "ohne-zeit-test.appspot.com",
          messagingSenderId: "1043845604698"
        }
      }
    }
  }

  return ENV;
};
