'use strict';

const {lineLength, typePrefix} = require('./all-prs');
const {repeat} = require('ramda');

beforeEach(() => {
  global.warn = jest.fn();
  global.fail = jest.fn();
});

afterEach(() => {
  global.warn = undefined;
  global.fail = undefined;
});

const setCommits = commits => global.danger = {git: {commits}};

const buildCommit = (
  message,
  sha = '66d8911a91facb389504a6774e4cf5538fed243e',
  author = 'Esteban',
) => ({
  sha,
  author,
  message,
  url: `https://github.com/wearereasonablepeople/RepoCop/pull/123/commits/${sha}`,
});

describe('lineLength', () => {
  it('should fail due to a maximum', () => {
    setCommits([
      buildCommit('small message'),
      buildCommit(repeat('lo', 100).join(), '1234567890'),
    ]);

    lineLength();
    expect(global.fail).toBeCalledWith(expect.stringContaining('12345'));
  });

  it('should accept small commits', () => {
    setCommits([
      buildCommit('small message'),
      buildCommit('another one'),
    ]);

    lineLength();
    expect(global.fail).not.toBeCalled();
  });
});

describe('format', () => {
  it('should warn to add prefix', () => {
    setCommits([
      buildCommit('feat: a prefix'),
      buildCommit('no prefix', '1234567890'),
    ]);

    typePrefix();
    expect(global.warn).toBeCalledWith(expect.stringContaining('12345'));
  });
  it('should be okay when all have a prefix', () => {
    setCommits([
      buildCommit('feat: a prefix'),
      buildCommit('Feat: also case insensitive'),
      buildCommit('ci: another one'),
    ]);

    typePrefix();
    expect(global.warn).not.toBeCalled();
  });
});
