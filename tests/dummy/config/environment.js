'use strict';

const pkg = require('../../../package.json');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    zug: {
      name: pkg.name,
      version: pkg.version
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
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if(process.env.CI) {
    ENV.test = {
      firebase: {
        config: {
          apiKey: "AIzaSyAvm8v8kXS3iHsg3EBxAk-mZZcYdeOuj3E",
          authDomain: "ember-cli-zug-travis.firebaseapp.com",
          databaseURL: "https://ember-cli-zug-travis.firebaseio.com",
          projectId: "ember-cli-zug-travis",
          storageBucket: "ember-cli-zug-travis.appspot.com",
          messagingSenderId: "715071933357"
        }
      }
    }
  }

  return ENV;
};
