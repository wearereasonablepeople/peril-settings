# wearereasonablepeople Peril Settings

Settings and danger rules for the [wearereasonablepeople organization](https://github.com/wearereasonablepeople).

# Danger

[Danger JS](http://danger.systems/js/) runs a set of rules against PRs to enforce conventions around code review.

In order to run the rules on your machine against an existing PR, do the following:

1. Go to your [github settings](https://github.com/settings/tokens) and generate a token with `repo` access
2. Add it to the `DANGER_GITHUB_API_TOKEN` env var:
```bash
export DANGER_GITHUB_API_TOKEN='your-token-here'
```

3. `npx danger pr {https://github.com/wearereasonablepeople/{repo}/pull/{pr number}`

# Peril

[Peril](https://github.com/danger/peril) is the hosted version of Danger and our preferred way of running org-wide checks.

Peril allows for some interesting things:

- Centralization of danger rules
- Single point of management for the github bot's token.
- Repo to to put RFCs

# Links

- [Peril](https://github.com/danger/peril)
- [Danger JS](http://danger.systems/js/)
- [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
