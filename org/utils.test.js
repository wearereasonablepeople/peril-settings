'use strict';

const {mdList} = require('./all-prs');

describe('mdList', () => {
  it.each([
    [[], ''],
    [['Hello', 'World'], '- Hello\n- World'],
    [['Hello'], '- Hello'],
  ])(
    'should render %p properly',
    (list, md) => expect(mdList(list)).toBe(md));
});
