# Testing ui-kit components

Here is the guide how to set up testing with Vitest and Vue Test Utils for the Acronis UI Component Library.

## Unit testing

We use [Vue Test Utils](https://vue-test-utils.vuejs.org/) and [Vitest](https://vitest.dev) for unit testing.

## Visual regression testing with Cypress

Visual regression testing is a technique to verify that the changes in the codebase
do not affect the visual appearance of the application.
For that purpose we mount **test components**(packages/documentation/demos)
and take **screenshots**(packages/ui/cypress/snapshots) of them.
Then we compare the screenshots with the baseline screenshots.
To run visual regression tests with Cypress, you need to run the following command:

```bash
pnpm run cypress:run
```

We must run regression tests in the same environment as the development environment.
Generated snapshots are used as a baseline for comparison.
Reference images taken in a docker environment are used for comparison.
To do this, we need to run cypress in docker container:

```bash
// Prepare the environment
pnpm run cypress:docker:build

// Run the tests and update snapshots
pnpm run cypress:docker:run
```

In GitHub Actions, we run the tests in the same way.
We use [visual-regression.yml](../../../.github/workflows/visual-regression.yml) workflow for this.
You can run the workflow manually in the GitHub Actions tab
or locally with [act](https://nektosact.com/) from the root directory.

```bash
act -j visual-regression
```

## Performance tests

TBD
