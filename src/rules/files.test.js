'use strict';

const {packageJsonChange, packageLockChange} = require('./files');

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
