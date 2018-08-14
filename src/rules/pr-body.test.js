'use strict';

const {missingChangesHeader, missingMotivationHeader} = require('./pr-body');

beforeEach(() => {
  global.warn = jest.fn();
  global.fail = jest.fn();
});

afterEach(() => {
  global.warn = undefined;
  global.fail = undefined;
});

const setPrBody = body => global.danger = {github: {pr: {body}}};

describe('PR body headers', () => {
  it('should require "Motivation"', () => {
    setPrBody('Fixes: #1234');
    missingMotivationHeader();
    expect(global.fail).toBeCalled();
  });
  it('should suggest "Changes"', () => {
    setPrBody('Fixes: #1234');
    missingChangesHeader();
    expect(global.warn).toBeCalled();
  });

  it('should be okay with the right headers', () => {
    setPrBody(`
# Motivation
Fixes: #1234

##changes
- Quite
- a
- bunch
`);
    missingMotivationHeader();
    missingChangesHeader();
    expect(global.warn).not.toBeCalled();
    expect(global.fail).not.toBeCalled();
  });
});
