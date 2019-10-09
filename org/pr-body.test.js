'use strict';

const {tests} = require('./all-prs');

const mockDanger = body => ({github: {pr: {body}}});

const motivation = `# Motivation
Fixes: #1234`;

const changes = `## Changes
- Quite
- a
- bunch`;

const defaultBody = `${motivation}
${changes}`;

const testAssertions = {
  missingMotivationHeader: [
    {fixture: mockDanger(defaultBody), expected: []},
    {fixture: mockDanger(''), expected: ['Please include a Motivation section']},
    {fixture: mockDanger(changes), expected: ['Please include a Motivation section']},
    {fixture: mockDanger('Lorem ipsum dolor sit amet'), expected: [
      'Please include a Motivation section',
    ]},
  ],

  missingChangesHeader: [
    {fixture: mockDanger(defaultBody), expected: []},
    {fixture: mockDanger(''), expected: ['PR text is missing a Changes section']},
    {fixture: mockDanger(motivation), expected: ['PR text is missing a Changes section']},
    {fixture: mockDanger('Lorem ipsum dolor sit amet'), expected: [
      'PR text is missing a Changes section',
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

