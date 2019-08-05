'use strict';

const {tests} = require('./all-prs');
const {repeat} = require('ramda');

const mockDanger = commits => ({git: {commits}});

const mockCommit = (message, sha = '66d8911a', author = 'Esteban') => ({
  sha,
  author,
  message,
  //eslint-disable-next-line camelcase
  html_url: `./commits/${sha}`,
});

const noApprovedVerb = (
  'Message for commit [`66d891`](./commits/66d8911a) starts with an uncommon verb, ' +
  'consider using one of: Add, Remove, Fix, Test, Document, Refactor, Style, ' +
  'Revert, Update, Configure, Deprecate, Correct, Improve, Initialise, Merge, Release.'
);

const noVerb = (
  'Message for commit [`66d891`](./commits/66d8911a) must start with an imperative verb.'
);

const testAssertions = {
  commitApprovedVerb: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger([mockCommit('Add new feature')]), expected: []},
    {fixture: mockDanger([mockCommit('Provoke new feature')]), expected: [noApprovedVerb]},
    {fixture: mockDanger([mockCommit('add new feature')]), expected: [noApprovedVerb]},
    {fixture: mockDanger([mockCommit('feat: 💩 I like emoji!!!')]), expected: [noApprovedVerb]},
  ],

  commitVerb: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger([mockCommit('Add new feature')]), expected: []},
    {fixture: mockDanger([mockCommit('Provoke new feature')]), expected: []},
    {fixture: mockDanger([mockCommit('add new feature')]), expected: [noVerb]},
    {fixture: mockDanger([mockCommit('feat: 💩 I like emoji!!!')]), expected: [noVerb]},
  ],

  commitMessageLength: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger([mockCommit('small message')]), expected: []},
    {fixture: mockDanger([mockCommit(repeat('lo', 100).join())]), expected: [
      'Commit [`66d891`](./commits/66d8911a) has lines with over 70 characters.'
    ]}
  ],

  commitMessageAscii: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger([mockCommit('foo bar')]), expected: []},
    {fixture: mockDanger([mockCommit('!@#$%^&*(){}[]')]), expected: []},
    {fixture: mockDanger([mockCommit('feat: 💩 I like emoji!!!')]), expected: [
      'Message header for commit [`66d891`](./commits/66d8911a) must contain ASCII characters only.'
    ]},
  ],

  commitMessagePunctuation: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger([mockCommit('foo bar')]), expected: []},
    {fixture: mockDanger([mockCommit('Merge branch "master" into "production"')]), expected: []},
    {fixture: mockDanger([mockCommit('feat: 💩 I like emoji!!!')]), expected: [
      'Message header for commit [`66d891`](./commits/66d8911a) must ' +
      'not end with punctuation.'
    ]},
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
