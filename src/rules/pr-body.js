'use strict';

const {ok} = require('./utils');
const missingMdHeader = header => !(new RegExp(`^#+ *${header}`, 'mi')).test(danger.github.pr.body);

exports.missingMotivationHeader = () =>
  missingMdHeader('Motivation')
    ? fail('Please include a Motivation section')
    : ok('missingMotivationHeader');
exports.missingChangesHeader = () =>
  missingMdHeader('Changes')
    ? warn('PR text is missing a Changes section')
    : ok('missingChangesHeader');
