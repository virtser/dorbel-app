process.env.LOG_LEVEL = 'error';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha); // patch mocha
