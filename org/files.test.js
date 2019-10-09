'use strict';

const {tests} = require('./all-prs');

// eslint-disable-next-line camelcase
const mockDanger = modified_files => ({git: {modified_files}});

const packageButNoLock = (
  'There are `package.json` changes with no corresponding `package-lock.json` changes'
);

const lockButNoPackage = (
  'There are `package-lock.json` changes with no corresponding `package.json` changes'
);

const testAssertions = {
  packageJsonChange: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger(['package.json', 'package-lock.json']), expected: []},
    {fixture: mockDanger(['package.json', 'package-lock.json', 'some-file.js']), expected: []},
    {fixture: mockDanger(['package.json']), expected: [packageButNoLock]},
    {fixture: mockDanger(['package-lock.json']), expected: []},
    {fixture: mockDanger(['some-file.js']), expected: []},
    {fixture: mockDanger(['one.js', 'other.js']), expected: []},
  ],

  packageLockChange: [
    {fixture: mockDanger([]), expected: []},
    {fixture: mockDanger(['package.json', 'package-lock.json']), expected: []},
    {fixture: mockDanger(['package.json', 'package-lock.json', 'some-file.js']), expected: []},
    {fixture: mockDanger(['package.json']), expected: []},
    {fixture: mockDanger(['package-lock.json']), expected: [lockButNoPackage]},
    {fixture: mockDanger(['some-file.js']), expected: []},
    {fixture: mockDanger(['one.js', 'other.js']), expected: []},
  ],
};

Object.keys(testAssertions).forEach(testCase => {
  describe(testCase, () => {
    testAssertions[testCase].forEach(({fixture, expected}, i) => {
      it(`passes test ${i + 1}`, () => {
        expect(tests[testCase].test(fixture)).toEqual(expected);
      });
    });
  });
});
