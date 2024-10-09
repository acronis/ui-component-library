# UI component library contributor: Onboarding

UI component library contributors are responsible for developing and maintaining the UI component library.
This guide provides information on how to get started as a UI component library contributor.

## Join the UI component library team

UI component library is an open-source project, and we welcome contributions from the community.

Contributing is easy:

- Identify the problem you want to solve.
- Create a bug report or change request.
- Create a fork of the repository.
- Follow the contribution guide and submit a pull request.
- Make changes in a separate branch of your fork.
- Create a pull request with your changes.

## Participate in onboarding meeting

The onboarding meeting is a weekly meeting where we discuss the progress of the UI component library.
The meeting is open to everyone, and we encourage you to join if you are interested in contributing to the UI component library.

Please provide feedback on the onboarding meeting to help us improve the process.
Do not hesitate to ask questions or share your thoughts.

## Check access to the UI component library repository

To contribute to the UI component library, you need access to the repository.
If you do not have access, please contact the UI component library team.

- [ ] Login to GitHub with your work or personal account
- [ ] Check access to the UI component library repository
- [ ] Fork the UI component library repository

## Git account

To contribute to the UI component library, you need a GitHub account.

To contribute with pull requests, you just need to fork the UI component library repository.

If you need special access, as access to GitHub project,
or you want to maintain some features please contact the UI component library team.

## Review the contribution process

Before contributing to the UI component library, please review the [contribution guidelines](https://acronis.github.io/ui-component-library/guide/contribution.html).
The guidelines provide information on how to contribute to the UI component library.

## Get comfortable with the UI component library

### Tech stack

We use Vue.Js in front-end development. You should be familiar with Vue.Js and the Composition API.

- [Vue.js](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue.js style guide](https://vuejs.org/style-guide/)

Also, we use Vite as a build tool and some tools:

- [Vite](https://vitejs.dev/) as a build tool
- [Storybook](https://storybook.js.org/) as a component explorer
- [Vitest](https://vitest.dev/) for unit testing
- [Cypress](https://jestjs.io/) for end-to-end and visual regression testing

To get comfortable with the UI component library, you should:

- Read the [documentation](https://acronis.github.io/ui-component-library) and [onboarding guide](https://acronis.github.io/ui-component-library/guide/onboarding.html)
- Review the [style guide](https://acronis.github.io/ui-component-library/styleguide/vue.html) for front-end development
- Learn how to [build](https://acronis.github.io/ui-component-library/guide/build.html) and [test](https://acronis.github.io/ui-component-library/guide/testing.html) the UI component library
- Learn project [architecture and code structure](https://github.com/acronis/ui-component-library/blob/main/README.md)
- Read about used common approaches and patterns
- Read guide for [testing](https://acronis.github.io/ui-component-library/guide/testing.html) and investigation of unit tests implementation
- Read guide for writing [documentation](https://acronis.github.io/ui-component-library/styleguide/documentation.html)
- Learn our [git workflow](https://acronis.github.io/ui-component-library/guide/git.html)
- Learn how we manage [issues and pull requests](https://acronis.github.io/ui-component-library/styleguide/issues.html)
- Learn how to run the UI component library in [development mode](https://acronis.github.io/ui-component-library/guide/development.html)
- Get know how to [use](https://acronis.github.io/ui-component-library/guide/install.html) the UI component library in your project
- Get know how to support localisation and internationalisation
- Get know how to support [accessibility](https://acronis.github.io/ui-component-library/styleguide/accessibility.html)

Common practice is learning project architecture and code structure by reading the code, README and documentation.
If you found some white spots or unclear parts,
please ask the UI component library team or feel free to create fix that as an issue.

## Get started with the UI component library

- inspect documentation with demos
- learn how basic components are implemented and how they can be used
- learn how to build and test the UI component library

## UI component library GitHub actions

We use GitHub actions to automate the build and test process.

These are the GitHub actions we use:

- on every pull request create or update, we run the [CI](https://github.com/acronis/ui-component-library/actions/workflows/ci.yml) pipeline
- on every push to the main branch, we run the [CI](https://github.com/acronis/ui-component-library/actions/workflows/ci.yml), [visual regression tests](https://github.com/acronis/ui-component-library/actions/workflows/visual-regression.yml) and [release](https://github.com/acronis/ui-component-library/actions/workflows/ui-release.yml) pipelines
- on every release, we run the publishing pipelines (we publish the **[ui](https://github.com/acronis/ui-component-library/actions/workflows/ui-npm-publish.yml)**, **icons** and **figma-fetcher** packages to the npm registry)
- on update of the documentation or demos, we run the [documentation pipeline](https://github.com/acronis/ui-component-library/actions/workflows/docs-deploy.yml), result will be deployed to the GitHub pages

## Figma mockups

We use [Figma](https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Syntax-UI-3.0?m=auto&t=UdCyS53msjFrcILL-6) to create mockups for the UI component library.

- [Figma - Syntax UI 3.0](https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Syntax-UI-3.0?m=auto&t=UdCyS53msjFrcILL-6)
- Components that are ready for development are marked with a green checkmark
- Components that are in progress are marked with a yellow checkmark
- Components that are not ready for development are marked with a red checkmark
- We use Figma local variables to define colors, typography, and spacing
- In UI component library monorepo, we have tool that fetches styles from Figma and generates css properties for the UI component library
- Also, we export icons from Figma and use them in the UI component library as svg icons

## Storybook

We use [Storybook](https://acronis.github.io/ui-component-library/storybook) to develop and test components in isolation.
Designers and developers can use Storybook to review components and provide feedback.

Please provide basic stories for components you develop.

## Testing

We use [Vitest](https://vitest.dev) for unit testing and [Cypress](https://www.cypress.io/) for end-to-end and visual regression testing.

Please provide unit tests for components you develop.

## Documentation

- [Main Documentation](https://acronis.github.io/ui-component-library)
- [Vue.Js Styleguide](https://acronis.github.io/ui-component-library/styleguide/vue.html)
- [Vue.Js Composition API guide](https://acronis.github.io/ui-component-library/styleguide/composable.html)
- [Styles guide](https://acronis.github.io/ui-component-library/styleguide/styles.html)
- [Unit tests guide](https://acronis.github.io/ui-component-library/styleguide/test.html)
- [Accessibility guide](https://acronis.github.io/ui-component-library/styleguide/accessibility.html)
- [Issues guide](https://acronis.github.io/ui-component-library/styleguide/issues.html)
- [GIT workflow](https://acronis.github.io/ui-component-library/styleguide/git.html)
- [Testing workflow](https://acronis.github.io/ui-component-library/guide/testing.html)

## Useful links

- [UI component library repository](https://github.com/acronis/ui-component-library)
- [UI component library Documentation](https://acronis.github.io/ui-component-library)
- [UI component library Storybook](https://acronis.github.io/ui-component-library/storybook)
- [Vitest coverage report](https://acronis.github.io/ui-component-library/coverage/)
- [Figma - Syntax UI 3.0](https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Syntax-UI-3.0?m=auto&t=UdCyS53msjFrcILL-6)
- [Figma - Acronis Icons](https://www.figma.com/design/SeWLzXxzzYfvfjzzbTYUl1/05-Icons---Glyphs?node-id=784-2)
