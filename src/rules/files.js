'use strict';

const {packageButNoLock, lockButNoPackage, ok} = require('./utils');

exports.packageJsonChange = () =>
  packageButNoLock(danger.git.modified_files)
    ? warn('There are `package.json` changes with no corresponding `package-lock.json` changes')
    : ok('packageJsonChange');

exports.packageLockChange = () =>
  lockButNoPackage(danger.git.modified_files)
    ? warn('There are `package-lock.json` changes with no corresponding `package.json` changes')
    : ok('packageLockChange');
