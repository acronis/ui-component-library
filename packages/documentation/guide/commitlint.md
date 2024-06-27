# Generating changelog and conventional commits

## Conventional Commits

The Conventional Commits specification improves commit messages by providing rules for creating a specific commit history.
Conventional Commits makes generating a changelog easy by creating a release that uses semantic versioning.

According to convention, the commit message should be structured as follows:

```git-commit
<type>([optional scope]): <description>

[optional body]

[optional footer(s)]
```

**type** is a type of commit that affects the version number of the release. In semantic versioning, the fix type affects PATCH and the feat type affects MINOR.
There are other types, however, these don’t affect the version number of the release.

scope is an optional noun that describes the part of the codebase that is changed or updated by the commit. For example, in feat(pages), pages is the scope.

In semantic versioning, ! correlates with MAJOR. When used after the scope, ! indicates that there are breaking changes in the commit.

**description** is a brief, written explanation of the changes made to the code. For example, if we wrote a description for feat(pages), it could look like the following: feat(pages): add contact page in the side menu.

**body** is an optional field that you can use to describe the commit in more detail. body must begin one line after the description. footer is also an optional field. For example, one footer is BREAKING CHANGE, which would correlate with MAJOR in semantic versioning.

### Examples of commit messages

```git-commit
feat: add the selection option for tree
```

```git-commit
fix(popover, TASK-123): Change title width of popover
```

```git-commit
refactor(api, TASK-321): remove deprecated color tokens

BREAKING CHANGE: refactor to remove usage of deprecated scss variables from components
```

## How to commit changes

Create your features and commit them.
If commit messages aren’t following convention, commitlint will raise errors.
You can execute the npm run commit in the command line to make a commit with Commitizen
or create commit manually with type, scope and description.

## How to create new release

Run npm run release to create a changelog and a semantic versioning-based release


## How to generate changelog

Run npm run changelog to generate a changelog based on the commit history.
Use [keepachangelog.com](https://keepachangelog.com/en/1.1.0/) as a reference for writing changelogs.
