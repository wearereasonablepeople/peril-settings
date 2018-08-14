'use strict';

const {
  any,
  map,
  prop,
  compose,
  filter,
  isEmpty,
  split,
  ap,
  of,
  none,
} = require('ramda');
const {mdList, ok} = require('./utils');

// TODO: consider using https://github.com/marionebl/commitlint
const commitTypes = [
  'feat:',
  'fix:',
  'test:',
  'ci:',
  'chore:',
  'docs:',
  'refactor:',
  'style:',
  'perf:',
  'revert:',
];

const linkForCommit = commit => `[${commit.hash.slice(0, 6)}](${commit.url})`;

const commitMsg = prop('message');

const startsWithI = needle => haystack => haystack.toLowerCase().startsWith(needle);
const unknownPrefix = compose(none(Boolean), ap(map(startsWithI, commitTypes)), of);
const commitsWithUnkownType =
  filter(compose(unknownPrefix, commitMsg));

const hasLinesOver = n => compose(
  any(line => line.length > n),
  split('\n'),
);
const commitsWithLinesOver = n =>
  filter(compose(hasLinesOver(n), commitMsg));

const maxCommitLineLength = 100;

const reportCommits = (reporter, messageFn) => compose(
  reporter,
  mdList,
  map(messageFn),
);

exports.lineLength = () => {
  const offendingCommits = commitsWithLinesOver(maxCommitLineLength)(danger.git.commits);
  if (!isEmpty(offendingCommits)) {
    reportCommits(fail, commit =>
      `Commit ${linkForCommit(commit)} has lines with over ${maxCommitLineLength} chars.`
    )(offendingCommits);
  } else {
    ok('lineLength');
  }
};

exports.typePrefix = () => {
  const offendingCommits = commitsWithUnkownType(danger.git.commits);
  if (!isEmpty(offendingCommits)) {
    reportCommits(warn, commit =>
      `Commit ${linkForCommit(commit)} doesn't contain a known commit type`
    )(offendingCommits);
  } else {
    ok('typePrefix');
  }
};
