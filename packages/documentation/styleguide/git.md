# Git workflow

We use Git as a version control system to manage the source code of the UI component library.

## Branches

We use the following branches in the UI component library repository:

- `main` - the main branch of the repository
- `develop` - the development branch of the repository
- `feature/*` - the branch for new features
- `fix/*` - the branch for bug fixes
- `hotfix/*` - the branch for critical bug fixes
- `release/*` - the branch for release preparation
- `docs/*` - the branch for documentation changes
- `chore/*` - the branch for changes that do not affect the code
- `refactor/*` - the branch for code refactoring
- `test/*` - the branch for testing changes
- `ci/*` - the branch for CI/CD changes
- `style/*` - the branch for style changes
- `perf/*` - the branch for performance improvements
- `security/*` - the branch for security fixes
- `deps/*` - the branch for dependency updates
- `wip/*` - the branch for work in progress

When starting new tasks, create a new branch from the `main` branch.

- Fork the project to your own space
- Clone your fork to local
- Create a new branch from the `main` branch, for example: "feature/AUK-1234" or "fix/checkbox-issue".
- Commit your work for the task. Your commits should follow conventional commit rules. [Read more](https://acronis.github.io/ui-component-library/guide/commitlint.html).
- Push your commit to your forked repository.
- Create a pull request to the main repository
