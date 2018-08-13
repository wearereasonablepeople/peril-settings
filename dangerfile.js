'use strict';

const {forEach} = require('ramda');

const allRules = require('./src/rules');

const runRules = forEach(f => f());

const disableDanger = (danger.github.pr.body + danger.github.pr.title).includes('#skipDangerCheck');
if (disableDanger) {
  warn('Danger check is disabled by including #skipDangerCheck in the body or the title');
} else {
  runRules(allRules);
}
