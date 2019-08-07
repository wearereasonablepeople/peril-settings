# wearereasonablepeople Peril Settings

Settings and danger rules for the [wearereasonablepeople organization](https://github.com/wearereasonablepeople).

**WARN**: Update [`README.hbs`]() instead of this file, it is generated with `npm run readme`

# Rules

This is the list of current rules in this repository:

<dl>
<dt>
  <a href="org/all-prs.js#70"><strong>lineLength</strong></a>
</dt>
<dd>
  Fails when any commit except Merge commits have a line in their body that exceeds 100 characters
</dd>
<dt>
  <a href="org/all-prs.js#99"><strong>typePrefix</strong></a>
</dt>
<dd>
  Warns when a commit does not have a known type prefix:

  - feat:
  - fix:
  - test:
  - ci:
  - chore:
  - docs:
  - refactor:
  - style:
  - perf:
  - revert:
</dd>
<dt>
  <a href="org/all-prs.js#127"><strong>packageJsonChange</strong></a>
</dt>
<dd>
  Warns when `package.json` changes but `package-lock.json` doesn't
</dd>
<dt>
  <a href="org/all-prs.js#135"><strong>packageLockChange</strong></a>
</dt>
<dd>
  Warns when `package-lock.json` changes but `package.json` doesn't
</dd>
<dt>
  <a href="org/all-prs.js#156"><strong>noReviewers</strong></a>
</dt>
<dd>
  Fails when there are no requested reviewers
</dd>
<dt>
  <a href="org/all-prs.js#164"><strong>authorPrefix</strong></a>
</dt>
<dd>
  Warns when the PR's branch doesn't start with the opener's github handle or a substring of it
</dd>
<dt>
  <a href="org/all-prs.js#173"><strong>assignee</strong></a>
</dt>
<dd>
  Warns when the PR has no assignee
</dd>
<dt>
  <a href="org/all-prs.js#186"><strong>missingMotivationHeader</strong></a>
</dt>
<dd>
  Warns when there's no `# Motivation` header in the PR markdown body
</dd>
<dt>
  <a href="org/all-prs.js#194"><strong>missingChangesHeader</strong></a>
</dt>
<dd>
  Warns when there's no `# Changes` header in the PR markdown body
</dd>
</dl>

# Danger

[Danger JS][] runs a set of rules against PRs to enforce conventions around code review.

## Running locally

In order to run the rules on your machine against an existing PR, do the following:

1. Go to your [github settings](https://github.com/settings/tokens) and generate a token with `repo` access
2. Add it to the `DANGER_GITHUB_API_TOKEN` env var:
```bash
export DANGER_GITHUB_API_TOKEN='your-token-here'
```

3. `npx danger pr {https://github.com/wearereasonablepeople/{repo}/pull/{pr number}`

# Peril

[Peril][] is the hosted version of Danger and our preferred way of running org-wide checks.

Peril allows for some interesting things:

- Centralization of danger rules
- Single point of management for the github bot's token.
- Repo to to put RFCs

# Updating Danger JS rules
See the [contribution guide](./CONTRIBUTING.md#updating-rules)

# Links

- [Peril][]
- [Danger JS][]
- [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)

[Peril]: https://github.com/danger/peril
[Danger JS]: http://danger.systems/js/
