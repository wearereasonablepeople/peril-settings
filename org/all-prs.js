/**
 * This file includes rules for all PRs in the org.
 *
 * Each rule is exposed as a 0-arity function that reads from the global `danger` object that
 * is injected with metadata about pull requests
 *
 * For documentation on that metadata see http://danger.systems/js/reference.html
 */

'use strict';

const {capitalized} = require('is-verb');
const {
  any,
  both,
  complement,
  compose,
  contains,
  filter,
  flip,
  forEach,
  head,
  ifElse,
  isNil,
  join,
  last,
  lt,
  map,
  path,
  pipe,
  reject,
  split,
  startsWith,
  toPairs,
} = require('ramda');

const isAscii = exports.isAscii = str => Buffer.from(str, 'utf8').toString('ascii') === str;
const mdList = exports.mdList = items => join('\n', items.map(t => `- ${t}`));

//eslint-disable-next-line no-console
const ok = test => console.info(`${test} OK`);

const approvedVerbs = [
  'Add',
  'Remove',
  'Fix',
  'Test',
  'Document',
  'Refactor',
  'Style',
  'Revert',
  'Update',
  'Configure',
  'Deprecate',
  'Correct',
  'Improve',
  'Initialise',
  'Merge',
  'Release',
];

const linkForCommit = commit => `[\`${commit.sha.slice(0, 6)}\`](${commit.html_url})`;
const commitMsg = path(['commit', 'message']);
const excludeMergeCommits = reject(compose(startsWith('Merge'), commitMsg));
const R_PUNCTUATION = /[.?!]/;

const hasPackageChanges = contains('package.json');
const hasLockfileChanges = contains('package-lock.json');

const authorMatchesBranchPrefix = d => {
  const parts = split('/', d.github.pr.head.ref);
  const login = d.github.pr.user.login.toLowerCase();
  const prefix = head(parts).toLowerCase();
  // allow for substring of login
  return parts.length >= 2 && prefix.length >= 2 && contains(prefix, login);
};

exports.tests = {

  // # Commits
  // Rules related to commit descriptions and body

  commitApprovedVerb: {
    critical: false,
    test: pipe(
      path(['github', 'commits']),
      reject(pipe(commitMsg, split(' '), head, flip(contains)(approvedVerbs))),
      map(linkForCommit),
      map(commit => (
        `Message for commit ${commit} starts with an uncommon verb, ` +
        `consider using one of: ${approvedVerbs.join(', ')}.`
      )),
    ),
  },

  commitVerb: {
    critical: true,
    test: pipe(
      path(['github', 'commits']),
      reject(pipe(commitMsg, split(' '), head, capitalized)),
      map(linkForCommit),
      map(commit => (
        `Message for commit ${commit} must start with an imperative verb.`
      )),
    ),
  },

  commitMessageLength: {
    critical: true,
    test: pipe(
      path(['github', 'commits']),
      excludeMergeCommits,
      filter(pipe(commitMsg, split('\n'), any(x => x.length > 70))),
      map(linkForCommit),
      map(commit => (
        `Commit ${commit} has lines with over 70 characters.`
      )),
    )
  },

  commitMessageAscii: {
    critical: true,
    test: pipe(
      path(['github', 'commits']),
      reject(pipe(commitMsg, split('\n'), head, isAscii)),
      map(linkForCommit),
      map(commit => (
        `Message header for commit ${commit} must contain ASCII characters only.`
      )),
    ),
  },

  commitMessagePunctuation: {
    critical: true,
    test: pipe(
      path(['github', 'commits']),
      filter(pipe(commitMsg, split('\n'), head, last, x => R_PUNCTUATION.test(x))),
      map(linkForCommit),
      map(commit => (
        `Message header for commit ${commit} must not end with punctuation.`
      )),
    ),
  },

  // # Files
  // Rules related to specific changed files in PRs.

  /**
   * Warns when `package.json` changes but `package-lock.json` doesn't
   */
  packageJsonChange: {
    critical: false,
    test: pipe(
      path(['git', 'modified_files']),
      ifElse(
        both(hasPackageChanges, complement(hasLockfileChanges)),
        () => [
          'There are `package.json` changes with no corresponding `package-lock.json` changes',
        ],
        () => [],
      ),
    ),
  },

  /**
   * Warns when `package-lock.json` changes but `package.json` doesn't
   */
  packageLockChange: {
    critical: false,
    test: pipe(
      path(['git', 'modified_files']),
      ifElse(
        both(complement(hasPackageChanges), hasLockfileChanges),
        () => [
          'There are `package-lock.json` changes with no corresponding `package.json` changes',
        ],
        () => [],
      ),
    ),
  },

  // # People
  // Rules related to PR assignees, reviewers, etc.

  /**
   * Fails when there are no requested reviewers
   */
  noReviewers: {
    critical: true,
    test: pipe(
      path(['github', 'requested_reviewers', 'length']),
      ifElse(
        flip(lt)(1),
        () => ['No reviewers requested for this PR'],
        () => [],
      ),
    ),
  },

  /**
   * Warns when the PR's branch doesn't start with the opener's github handle or a substring of it
   */
  authorPrefix: {
    critical: false,
    test: d => authorMatchesBranchPrefix(d)
      ? []
      : [
        'Please rename your base branch so it has your username as a prefix:\n' +
        `\`git checkout -b ${d.github.pr.user.login}/${d.github.pr.head.ref}\``,
      ],
  },

  /**
   * Warns when the PR has no assignee
   */
  assignee: {
    critical: false,
    test: pipe(
      path(['github', 'pr', 'assignee']),
      ifElse(
        isNil,
        () => ['Please assign someone to merge this PR.'],
        () => [],
      ),
    ),
  },

};

// # PR text body
// Rules related to the PR's body of markdown text

const missingMdHeader = header => !(new RegExp(`^#+ *${header}`, 'mi')).test(danger.github.pr.body);

/**
 * Warns when there's no `# Motivation` header in the PR markdown body
 */
exports.missingMotivationHeader = () =>
  missingMdHeader('Motivation')
    ? warn('Please include a Motivation section')
    : ok('missingMotivationHeader');

/**
 * Warns when there's no `# Changes` header in the PR markdown body
 */
exports.missingChangesHeader = () =>
  missingMdHeader('Changes')
    ? warn('PR text is missing a Changes section')
    : ok('missingChangesHeader');

const runTests = pipe(toPairs, forEach(([name, {critical, test}]) => {
  const errors = test(danger);
  const reporter = critical ? fail : warn;
  if (errors.length === 0) {
    ok(name);
  } else {
    reporter(mdList(errors));
  }
}));

Object.defineProperty(exports, '__esModule', {value: true});
exports.default = () => {
  runTests(exports.tests);
  exports.missingMotivationHeader();
  exports.missingChangesHeader();
};
