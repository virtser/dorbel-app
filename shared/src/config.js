'use strict';
const nconf = require('nconf');
const path = require('path');

let config = nconf
  .argv() // command line args and environment vars are top priority
  .env();

function setConfigFileFolder(folder) {
  const environmentConfigFile = path.join(folder, process.env.NODE_ENV + '.json');
  const sharedConfigFile = path.join(folder, 'shared.json');
  config = config
    .file('env', environmentConfigFile) // files are last in the priority
    .file('shared', sharedConfigFile ); // shared comes last
}

function get(key) {
  return config.get(key);
}

module.exports = {
  setConfigFileFolder,
  get: get
};