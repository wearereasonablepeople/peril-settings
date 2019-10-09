'use strict';

/* eslint-disable camelcase */

const {tests} = require('./all-prs');

const mockDanger = ({
  requested_reviewers = [{login: 'esteban'}],
  ref = 'author/branch-name',
  login = 'author',
  assignee = {login: 'author'},
} = {}) => ({
  github: {
    requested_reviewers,
    pr: {
      head: {ref},
      user: {login},
      assignee,
    },
  },
});

const noPrefix = (
  'Please rename your base branch so it has your username as a prefix:\n' +
  '`git checkout -b author/branch-name`'
);

const testAssertions = {
  noReviewers: [
    {fixture: mockDanger(), expected: []},
    {fixture: mockDanger({requested_reviewers: []}), expected: [
      'No reviewers requested for this PR'
    ]},
  ],

  authorPrefix: [
    {fixture: mockDanger(), expected: []},
    {fixture: mockDanger({ref: 'branch-name'}), expected: [noPrefix]},
    {fixture: mockDanger({ref: 'bob/branch-name', login: 'bob'}), expected: []},
    {fixture: mockDanger({ref: 'denver/branch-name', login: 'DenverCoder9'}), expected: []},
  ],

  assignee: [
    {fixture: mockDanger(), expected: []},
    {fixture: mockDanger({assignee: null}), expected: ['Please assign someone to merge this PR.']},
  ],
};

Object.keys(testAssertions).forEach(testcase => {
  describe(testcase, () => {
    testAssertions[testcase].forEach(({fixture, expected}, i) => {
      it(`passes test ${i + 1}`, () => {
        expect(tests[testcase].test(fixture)).toEqual(expected);
      });
    });
  });
});
