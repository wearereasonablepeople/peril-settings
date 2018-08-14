'use strict';

const people = require('./people');
const prBody = require('./pr-body');
const commits = require('./commits');
const files = require('./files');

const {compose, filter, values, map, flatten} = require('ramda');

const getFunctions = compose(filter(v => typeof v === 'function'), values);

module.exports = compose(flatten, map(getFunctions))([
  people,
  prBody,
  commits,
  files,
]);
