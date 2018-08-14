'use strict';

const {
  mdList,
  packageButNoLock,
  lockButNoPackage,
} = require('./utils');

describe('mdList', () => {
  it.each([
    [[], ''],
    [['Hello', 'World'], '- Hello\n- World'],
    [['Hello'], '- Hello'],
  ])(
    'should render %p properly',
    (list, md) => expect(mdList(list)).toBe(md));
});

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
