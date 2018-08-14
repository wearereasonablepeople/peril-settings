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
  join,
  contains,
  both,
  complement,
} = require('ramda');

// # Markdown utils
const mdList = items => isEmpty(items) ? '' : `- ${join('\n- ', items)}`;
exports.mdList = mdList;

//eslint-disable-next-line no-console
const ok = test => console.info(`${test} OK`);

// # Commits
// Rules related to commit descriptions and body

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

// # Files
// Rules related to specific changed files in PRs.

const hasPackageChanges = contains('package.json');
const hasLockfileChanges = contains('package-lock.json');
const packageButNoLock = both(hasPackageChanges, complement(hasLockfileChanges));
exports.packageButNoLock = packageButNoLock;
const lockButNoPackage = both(complement(hasPackageChanges), hasLockfileChanges);
exports.lockButNoPackage = lockButNoPackage;

exports.packageJsonChange = () =>
  packageButNoLock(danger.git.modified_files)
    ? warn('There are `package.json` changes with no corresponding `package-lock.json` changes')
    : ok('packageJsonChange');

exports.packageLockChange = () =>
  lockButNoPackage(danger.git.modified_files)
    ? warn('There are `package-lock.json` changes with no corresponding `package.json` changes')
    : ok('packageLockChange');

// # People
// Rules related to PR assignees, reviewers, etc.

const noAssignee = () => !danger.github.pr.assignee;
const atLeastNReviewers = n => danger.github.requested_reviewers.length < n;
const authorMatchesBranchPrefix = () =>
  danger.github.pr.base.ref.startsWith(`${danger.github.pr.user.login}/`);

exports.noReviewers = () =>
  atLeastNReviewers(1)
    ? fail('No reviewers requested for this PR')
    : ok('noReviewers');

exports.authorPrefix = () =>
  !authorMatchesBranchPrefix()
    ? warn(`Please rename your base branch so it has your username as a prefix:
    \`git checkout -b ${danger.github.pr.user.login}/${danger.github.pr.base.ref}\``)
    : ok('authorPrefix');

exports.assignee = () =>
  noAssignee()
    ? warn('Please assign someone to merge this PR.')
    : ok('assignee');

// # PR text body
// Rules related to the PR's body of markdown text

const missingMdHeader = header => !(new RegExp(`^#+ *${header}`, 'mi')).test(danger.github.pr.body);

exports.missingMotivationHeader = () =>
  missingMdHeader('Motivation')
    ? fail('Please include a Motivation section')
    : ok('missingMotivationHeader');
exports.missingChangesHeader = () =>
  missingMdHeader('Changes')
    ? warn('PR text is missing a Changes section')
    : ok('missingChangesHeader');

Object.defineProperty(exports, '__esModule', {value: true});
exports.default = () => {
  exports.lineLength();
  exports.typePrefix();
  exports.packageJsonChange();
  exports.packageLockChange();
  exports.noReviewers();
  exports.authorPrefix();
  exports.assignee();
  exports.missingMotivationHeader();
  exports.missingChangesHeader();
};