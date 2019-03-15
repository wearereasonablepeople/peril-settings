# Contributing to this project

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue or assessing
patches and features.

# Contacting the team
The preferred way of contacting the team is by creating [GitHub Issues](https://guides.github.com/features/issues/) in the project's repository.

# Issue Tracker
The issue tracker for this project are GitHub Issues. In order to submit one:

1. Make your you have a [GitHub account](https://github.com/signup/free);
2. Create an issue on the project's issue page;
3. Fill the issue template and create a new issue;

## Pull Request Process

1. Prefer to open an issue before starting any implementation of your own to allow for discussion;
2. Fork and clone the project locally;
3. Commit changes to a branch named after the work that was done;
4. Follow instructions in the README to build and work with the code;
5. Make sure the tests pass locally on your machine;
6. Create a Pull Request;

# Updating rules

When updating or creating rules for all pull requests:

1. Create a new function for it in [`all-prs.js`](./org/all-prs.js)
2. Create relevant unit tests in a `*.test.js`, these should mock `global.warn|fail`
with spies to verify behavior and inject data by mocking `global.danger.*`
3. Update the README with `npm run readme`
4. Open a PR
