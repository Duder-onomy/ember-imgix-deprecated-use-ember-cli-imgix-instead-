/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {

  });

  app.import('node_modules/js-base64/base64.js');
  app.import('node_modules/imgix-core-js/dist/imgix-core-js.js');

  return app.toTree();
};
