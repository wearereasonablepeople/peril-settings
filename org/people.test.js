'use strict';

beforeEach(() => {
  global.warn = jest.fn();
  global.fail = jest.fn();
});

afterEach(() => {
  global.warn = undefined;
  global.fail = undefined;
});

const {noReviewers, authorPrefix, assignee} = require('./all-prs');

//eslint-disable-next-line camelcase
const setReviewers = rs => global.danger = {github: {requested_reviewers: rs}};
const setPrMeta = (ref, login, assignee) => global.danger = {github: {pr: {
  user: {login},
  assignee,
  head: {ref},
  base: {ref: 'master'},
}}};

describe('reviewers', () => {
  it('should fail when no reviewers', () => {
    setReviewers([]);
    noReviewers();
    expect(global.fail).toBeCalled();
  });

  it('should be okay with a single reviewer', () => {
    setReviewers(['Esteban']);
    noReviewers();
    expect(global.fail).not.toBeCalled();
  });
});

describe('branch name', () => {
  it('should start with author name', () => {
    setPrMeta('branch-name', 'author');
    authorPrefix();
    expect(global.warn).toBeCalledWith(expect.stringContaining('author'));
  });
  it('should be okay if prefix is correct', () => {
    setPrMeta('author/branch-name', 'author');
    authorPrefix();
    expect(global.warn).not.toBeCalled();
  });
});

describe('assignee', () => {
  it('should warn if not present', () => {
    setPrMeta('branch-name', 'author', undefined);
    assignee();
    expect(global.warn).toBeCalled();
  });
  it('should be okay if present', () => {
    setPrMeta('branch-name', 'author', 'esteban');
    assignee();
    expect(global.warn).not.toBeCalled();
  });
});
