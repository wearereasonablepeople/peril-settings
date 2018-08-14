'use strict';

const {ok} = require('./utils');

const noAssignee = () => !danger.github.pr.assignee;
const atLeastNReviewers = n => danger.github.requested_reviewers.length < n;
const authorMatchesBranchPrefix = () =>
  danger.github.pr.base.ref.startsWith(`${danger.github.pr.user.login}/`);

exports.noReviewers = () =>
  atLeastNReviewers(1)
    ? fail('No reviewers requested for this PR')
    : ok('noReviewers');

exports.authorPrefix = () =>
  !authorMatchesBranchPrefix()
    ? warn(`Please rename your base branch so it has your username as a prefix:
\`git checkout -b ${danger.github.pr.user.login}/${danger.github.pr.base.ref}\``)
    : ok('authorPrefix');

exports.assignee = () =>
  noAssignee()
    ? warn('Please assign someone to merge this PR.')
    : ok('assignee');
