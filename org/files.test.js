'use strict';

const {
  packageJsonChange,
  packageLockChange,
  packageButNoLock,
  lockButNoPackage,
} = require('./all-prs');

beforeEach(() => {
  global.warn = jest.fn();
  global.fail = jest.fn();
});

afterEach(() => {
  global.warn = undefined;
  global.fail = undefined;
});

//eslint-disable-next-line camelcase
const modFiles = files => ({git: {modified_files: files}});

describe('packageButNoLock', () => {
  it.each([
    [[], false],
    [['package.json', 'package-lock.json', 'some-file.js'], false],
    [['package-lock.json'], false],
    [['package.json'], true],
    [['some-file.js'], false],
  ])('%p should be %s',
    (changes, expected) => expect(packageButNoLock(changes)).toBe(expected));
});

describe('lockButNoPackage', () => {
  it.each([
    [[], false],
    [['package.json', 'package-lock.json', 'some-file.js'], false],
    [['package-lock.json'], true],
    [['package.json'], false],
    [['some-file.js'], false],
  ])('%p should be %s',
    (changes, expected) => expect(lockButNoPackage(changes)).toBe(expected));
});

describe('package and lockfile', () => {
  it('should warn when only the package file is edited', () => {
    global.danger = modFiles(['package.json']);
    packageJsonChange();
    expect(global.warn).toBeCalled();
  });
  it('should warn when only the lockfile is edited', () => {
    global.danger = modFiles(['package-lock.json']);
    packageLockChange();
    expect(global.warn).toBeCalled();
  });
  it('should ignore other files', () => {
    global.danger = modFiles(['one.js', 'other.js']);
    packageLockChange();
    packageJsonChange();
    expect(global.warn).not.toBeCalled();
    expect(global.fail).not.toBeCalled();
  });
});
