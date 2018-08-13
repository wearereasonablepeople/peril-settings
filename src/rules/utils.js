'use strict';

const {join, contains, both, complement, isEmpty} = require('ramda');

// Markdown
exports.mdList = items => isEmpty(items) ? '' : `- ${join('\n- ', items)}`;

//eslint-disable-next-line no-console
exports.ok = test => console.info(`${test} OK`);

// file checks
const hasPackageChanges = contains('package.json');
const hasLockfileChanges = contains('package-lock.json');
exports.packageButNoLock = both(hasPackageChanges, complement(hasLockfileChanges));
exports.lockButNoPackage = both(complement(hasPackageChanges), hasLockfileChanges);
